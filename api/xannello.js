import { proxyXannelloRequest } from "../server/xannelloProxy.js";

export default async function handler(request, response) {
  response.setHeader("Content-Type", "application/json; charset=utf-8");

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed." });
  }

  const result = await proxyXannelloRequest({
    authorization: globalThis.process?.env?.XANNELLO_AUTHORIZATION,
    endpoint: request.body?.endpoint,
    parameter: request.body?.parameter,
  });

  return response.status(result.status).json(result.body);
}
