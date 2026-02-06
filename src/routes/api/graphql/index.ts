import type { RequestHandler } from "@builder.io/qwik-city";

/**
 * GraphQL Proxy - Qwik City Route Handler
 *
 * Runs server-side within the Qwik Edge function.
 * Proxies GraphQL requests to Hasura, injecting the admin secret
 * so it never reaches the client/browser.
 */
export const onPost: RequestHandler = async ({ request, send, env }) => {
  // Try multiple env var names for maximum compatibility
  const hasuraUrl =
    env.get("HASURA_GRAPHQL_ENDPOINT") ||
    env.get("VITE_HASURA_GRAPHQL_ENDPOINT") ||
    import.meta.env.VITE_HASURA_GRAPHQL_ENDPOINT;

  const hasuraSecret =
    env.get("HASURA_ADMIN_SECRET") ||
    env.get("VITE_HASURA_ADMIN_SECRET") ||
    import.meta.env.VITE_HASURA_ADMIN_SECRET;

  if (!hasuraUrl) {
    send(
      new Response(
        JSON.stringify({
          errors: [{ message: "HASURA_GRAPHQL_ENDPOINT not configured" }],
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      ),
    );
    return;
  }

  let body: { query?: string; variables?: any; operationName?: string } | null =
    null;
  try {
    body = await request.json();
  } catch {
    send(
      new Response(
        JSON.stringify({ errors: [{ message: "Invalid JSON body" }] }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      ),
    );
    return;
  }

  if (!body?.query) {
    send(
      new Response(
        JSON.stringify({ errors: [{ message: "Missing GraphQL query" }] }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      ),
    );
    return;
  }

  // Build headers for Hasura
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (hasuraSecret) {
    headers["x-hasura-admin-secret"] = hasuraSecret;
  }

  // Forward Authorization header if present (JWT auth)
  const authHeader = request.headers.get("authorization");
  if (authHeader) {
    headers["Authorization"] = authHeader;
  }

  try {
    const hasuraResponse = await fetch(hasuraUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: body.query,
        variables: body.variables,
        operationName: body.operationName,
      }),
    });

    const responseText = await hasuraResponse.text();

    send(
      new Response(responseText, {
        status: hasuraResponse.status,
        headers: { "Content-Type": "application/json" },
      }),
    );
  } catch (error: any) {
    send(
      new Response(
        JSON.stringify({
          errors: [
            {
              message: `Proxy error: ${error?.message || "unknown"}`,
            },
          ],
        }),
        { status: 502, headers: { "Content-Type": "application/json" } },
      ),
    );
  }
};

/**
 * GET handler for health check / diagnostics
 * Visit /api/graphql in the browser to verify env vars are configured
 */
export const onGet: RequestHandler = async ({ send, env }) => {
  const hasuraUrl =
    env.get("HASURA_GRAPHQL_ENDPOINT") ||
    env.get("VITE_HASURA_GRAPHQL_ENDPOINT") ||
    import.meta.env.VITE_HASURA_GRAPHQL_ENDPOINT;

  const hasuraSecret =
    env.get("HASURA_ADMIN_SECRET") ||
    env.get("VITE_HASURA_ADMIN_SECRET") ||
    import.meta.env.VITE_HASURA_ADMIN_SECRET;

  send(
    new Response(
      JSON.stringify({
        status: "ok",
        hasEndpoint: !!hasuraUrl,
        endpointPreview: hasuraUrl
          ? hasuraUrl.substring(0, 30) + "..."
          : "NOT SET",
        hasSecret: !!hasuraSecret,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    ),
  );
};
