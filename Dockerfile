FROM oven/bun:1 as base
WORKDIR /usr/src/app

FROM base AS install
RUN mkdir -p /temp/dev/static 
COPY package.json bun.lockb /temp/dev/
COPY static/package.json static/bun.lockb /temp/dev/static/
RUN cd /temp/dev && bun install --frozen-lockfile
RUN cd /temp/dev/static && bun install --frozen-lockfile
 
RUN mkdir -p /temp/prod/static
COPY package.json bun.lockb /temp/prod/
COPY static/package.json static/bun.lockb /temp/prod/static/
RUN cd /temp/prod && bun install --frozen-lockfile --production 
RUN cd /temp/prod/static && bun install --frozen-lockfile --production

FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY --from=install /temp/dev/static/node_modules static/node_modules
COPY . .

ENV NODE_ENV=production
RUN bun run build

FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/package.json .
COPY --from=prerelease /usr/src/app/tsconfig.json .
COPY --from=prerelease /usr/src/app/app.ts .
COPY --from=prerelease /usr/src/app/Server.d.ts . 
COPY --from=prerelease /usr/src/app/routes ./routes
COPY --from=prerelease /usr/src/app/events ./events
COPY --from=prerelease /usr/src/app/static/build ./static/build
  
USER bun
ENV KEY_PATH=/home/bun/ssl/key.pem
ENV CERT_PATH=/home/bun/ssl/cert.pem
RUN mkdir -p /home/bun/ssl
ENTRYPOINT [ "bun", "run", "start" ]
