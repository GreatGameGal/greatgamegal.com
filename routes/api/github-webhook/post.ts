import * as crypto from "node:crypto";
import { Server } from "../../../Server";

export async function handle(this: Server, req: Request) {
  if (req.headers.get("x-hub-signature-256")) {
    const data = await req.text();

    const sig =
      "sha256=" +
      crypto
        .createHmac(
          "sha256",
          process.env.GITHUB_SECRET ?? crypto.randomBytes(32)
        ) // Random so an unconfigured GITHUB_SECRET shouldn't be exploitable.
        .update(data)
        .digest("hex");

    if (
      crypto.timingSafeEqual(
        Buffer.from(sig),
        Buffer.from(req.headers.get("x-hub-signature-256") ?? "")
      )
    ) {
      const body = JSON.parse(data);
      this.eventHandler.emit(
        "repo" + (req.headers.get("x-github-event") ?? "UNKNOWN_EVENT"),
        {
          body,
          repo: body.repository,
        }
      );

      return new Response(null, { status: 200 });
    }
  }
  return new Response("Unauthorized", { status: 401 });
}
