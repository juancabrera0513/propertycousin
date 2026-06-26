const XANNELLO_API_BASE = "https://xannello.com/api";
const PROPERTY_COUSINS_USER_ID = "6440";
const ALLOWED_ENDPOINTS = new Set([
  "basicSearch",
  "getListingByListingID",
]);

function sanitizeParameter(endpoint, parameter = {}) {
  if (endpoint === "basicSearch") {
    return {
      entity: "agent",
      usersID: PROPERTY_COUSINS_USER_ID,
    };
  }

  const listingID = String(parameter.listingID || "").trim();
  const MLS = String(parameter.MLS || "").trim();

  if (!listingID || !MLS) {
    throw new Error("A listing ID and MLS are required.");
  }

  return {
    listingID,
    MLS,
    usersID: PROPERTY_COUSINS_USER_ID,
  };
}

export async function proxyXannelloRequest({ authorization, endpoint, parameter }) {
  if (!authorization) {
    return {
      status: 500,
      body: { error: "Xannello authorization is not configured." },
    };
  }

  if (!ALLOWED_ENDPOINTS.has(endpoint)) {
    return {
      status: 400,
      body: { error: "Unsupported Xannello endpoint." },
    };
  }

  let safeParameter;

  try {
    safeParameter = sanitizeParameter(endpoint, parameter);
  } catch (error) {
    return {
      status: 400,
      body: { error: error.message },
    };
  }

  try {
    const response = await fetch(`${XANNELLO_API_BASE}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Authorization: authorization,
        parameter: safeParameter,
      }),
    });

    const body = await response.json();

    return {
      status: response.status,
      body,
    };
  } catch {
    return {
      status: 502,
      body: { error: "The MLS service is temporarily unavailable." },
    };
  }
}
