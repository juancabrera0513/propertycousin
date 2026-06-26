import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { proxyXannelloRequest } from "./server/xannelloProxy.js";

function xannelloDevelopmentProxy(authorization) {
  return {
    name: "xannello-development-proxy",
    configureServer(server) {
      server.middlewares.use("/api/xannello", (request, response) => {
        if (request.method !== "POST") {
          response.statusCode = 405;
          response.setHeader("Allow", "POST");
          response.end(JSON.stringify({ error: "Method not allowed." }));
          return;
        }

        let rawBody = "";

        request.on("data", (chunk) => {
          rawBody += chunk;
        });

        request.on("end", async () => {
          try {
            const body = JSON.parse(rawBody || "{}");
            const result = await proxyXannelloRequest({
              authorization,
              endpoint: body.endpoint,
              parameter: body.parameter,
            });

            response.statusCode = result.status;
            response.setHeader(
              "Content-Type",
              "application/json; charset=utf-8"
            );
            response.end(JSON.stringify(result.body));
          } catch {
            response.statusCode = 400;
            response.end(JSON.stringify({ error: "Invalid request body." }));
          }
        });
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");

  return {
    plugins: [react(), xannelloDevelopmentProxy(env.XANNELLO_AUTHORIZATION)],
  };
});
