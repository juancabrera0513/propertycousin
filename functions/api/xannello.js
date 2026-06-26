import { proxyXannelloRequest } from "../../server/xannelloProxy.js";

export async function onRequest(context) {
  const { env, request } = context;

  if (request.method !== "POST") {
    return Response.json(
      { error: "Method not allowed." },
      {
        status: 405,
        headers: {
          Allow: "POST",
        },
      }
    );
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const result = await proxyXannelloRequest({
    authorization: env.XANNELLO_AUTHORIZATION,
    endpoint: body.endpoint,
    parameter: body.parameter,
  });

  return Response.json(result.body, { status: result.status });
}
