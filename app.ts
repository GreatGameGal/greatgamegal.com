import EventEmitter from "events";
import { Server } from "./Server";

const basedir = import.meta.dir;
const RECURSIVE_TS_GLOB = new Bun.Glob("**/*.ts");

const ROUTE_TYPES = ["GET", "POST", "PUT", "PATCH", "DELETE"];
// Could be expanded if necessary, I don't expect it will be.
const NAME_ASSUMPTIONS = ["index.html", ".html", ".js", ".css"];

const { KEY_PATH, CERT_PATH, PORT, HTTP_PORT } = Object.assign(
  {},
  { PORT: "443" },
  process.env
);

if (KEY_PATH == null || CERT_PATH == null) {
  console.error("ERROR: Key path or cert path not provided.");
  process.exit(1);
}

const key = Bun.file(KEY_PATH);
const cert = Bun.file(CERT_PATH);

if (!key.exists()) {
  console.error(`ERROR: Key file ${KEY_PATH} does not exist.`);
  process.exit(1);
}
if (!cert.exists()) {
  console.error(`ERROR: Key file ${CERT_PATH} does not exist.`);
  process.exit(1);
}

const routes = new Map();
const events = [];

const server: Server = Object.assign(
  Bun.serve({
    async fetch(req) {
      const url = new URL(req.url);
      if (routes.has(`${url.pathname}/${req.method}`)) {
        return routes
          .get(`${url.pathname}/${req.method}`)
          .handle.call(server, req);
      }
      if (req.method == "GET") {
        const path = `${basedir}/static/build${url.pathname}`;
        let file = Bun.file(path);
        if (await file.exists()) {
          return new Response(file);
        }
        for (const extension of NAME_ASSUMPTIONS) {
          const newPath = path + extension;
          file = Bun.file(newPath);
          if (await file.exists()) {
            return new Response(file);
          }
        }
      }

      return new Response("ERROR: File not found", { status: 404 });
    },
    tls: {
      key,
      cert,
    },
    port: PORT,
  }),
  {
    eventHandler: new EventEmitter(),
    basedir,
  }
);

for await (const file of RECURSIVE_TS_GLOB.scan("./events")) {
  const path = `${basedir}/events/${file}`;
  const eventFile = await import(path);
  const event = eventFile.event;
  const run = eventFile.run.bind(event);
  server.eventHandler.addListener(event, run);
  events.push({
    event,
    run,
  });
}

for await (const file of RECURSIVE_TS_GLOB.scan("./routes")) {
  const path = `${basedir}/routes/${file}`;
  const method = file
    .slice(file.lastIndexOf("/") + 1, file.lastIndexOf("."))
    .toUpperCase();
  if (ROUTE_TYPES.includes(method)) {
    const route = await import(path);
    routes.set(`/${file.slice(0, file.lastIndexOf("/"))}/${method}`, route);
  } else {
    console.warn(
      `The file ${file} represents an unsupported method, it should be named one of the following: ${ROUTE_TYPES.map(
        (e) => e.toLowerCase() + ".ts"
      ).join(", ")}`
    );
  }
}

// Creates HTTP server to redirect to HTTPS server.
if (HTTP_PORT != undefined) {
  for (const portStr of HTTP_PORT.split(",")) {
    const port = parseFloat(portStr);
    if (!Number.isNaN(port) && Number.isInteger(port)) {
      Bun.serve({
        fetch(req) {
          const url = new URL(req.url);
          return Response.redirect(
            "https://" +
              url.hostname +
              (PORT != "443" ? `:${PORT}` : "") +
              url.pathname,
            308
          );
        },
        port,
      });
    }
  }
}
