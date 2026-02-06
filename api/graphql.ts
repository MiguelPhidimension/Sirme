export const config = {
  runtime: "edge",
};

const HASURA_GRAPHQL_ENDPOINT = process.env.HASURA_GRAPHQL_ENDPOINT;
const HASURA_ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET;

type GraphQLRequestBody = {
  query?: string;
  variables?: Record<string, unknown>;
  operationName?: string;
};

export default async function handler(req: Request): Promise<Response> {
  // GET = health/debug check (remove later)
  if (req.method === "GET") {
    return new Response(
      JSON.stringify({
        status: "ok",
        hasEndpoint: !!HASURA_GRAPHQL_ENDPOINT,
        endpointPreview: HASURA_GRAPHQL_ENDPOINT
          ? HASURA_GRAPHQL_ENDPOINT.substring(0, 30) + "..."
          : "NOT SET",
        hasSecret: !!HASURA_ADMIN_SECRET,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  if (!HASURA_GRAPHQL_ENDPOINT) {
    return new Response(
      JSON.stringify({
        errors: [{ message: "HASURA_GRAPHQL_ENDPOINT not configured" }],
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  let body: GraphQLRequestBody | null = null;
  try {
    body = (await req.json()) as GraphQLRequestBody;
  } catch {
    return new Response(
      JSON.stringify({ errors: [{ message: "Invalid JSON body" }] }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  if (!body?.query) {
    return new Response(
      JSON.stringify({ errors: [{ message: "Missing GraphQL query" }] }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  // Build headers for Hasura
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Always send admin secret if available (overrides JWT auth)
  if (HASURA_ADMIN_SECRET) {
    headers["x-hasura-admin-secret"] = HASURA_ADMIN_SECRET;
  }

  // Also forward Authorization if present (for JWT-based queries)
  const authHeader = req.headers.get("authorization");
  if (authHeader) {
    headers["Authorization"] = authHeader;
  }

  try {
    const hasuraResponse = await fetch(HASURA_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: body.query,
        variables: body.variables,
        operationName: body.operationName,
      }),
    });

    const responseText = await hasuraResponse.text();

    return new Response(responseText, {
      status: hasuraResponse.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        errors: [
          {
            message: `Proxy fetch failed: ${error?.message || "unknown error"}`,
          },
        ],
      }),
      { status: 502, headers: { "Content-Type": "application/json" } },
    );
  }
}
