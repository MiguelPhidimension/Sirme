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
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  if (!HASURA_GRAPHQL_ENDPOINT) {
    return new Response("Server env vars not configured", { status: 500 });
  }

  let body: GraphQLRequestBody | null = null;
  try {
    body = (await req.json()) as GraphQLRequestBody;
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  if (!body?.query) {
    return new Response("Missing GraphQL query", { status: 400 });
  }

  const authHeader = req.headers.get("authorization");
  const cookieHeader = req.headers.get("cookie");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (authHeader) {
    headers.Authorization = authHeader;
  }

  if (cookieHeader) {
    headers.Cookie = cookieHeader;
  }

  if (HASURA_ADMIN_SECRET) {
    headers["x-hasura-admin-secret"] = HASURA_ADMIN_SECRET;
  }

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
}
