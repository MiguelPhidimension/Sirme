# JWT Authentication with Hasura

This project now uses JWT (JSON Web Tokens) for authentication with Hasura GraphQL.

## Setup

1. **Configure JWT Secret**

   - Update `.env.local` with a secure JWT secret (minimum 32 characters)
   - This secret is used to sign and verify JWT tokens

2. **Hasura JWT Configuration**
   - In your Hasura Cloud console or docker-compose.yml, add:
   ```yaml
   HASURA_GRAPHQL_JWT_SECRET: '{"type":"HS256","key":"your-super-secret-jwt-key-change-this-in-production-minimum-32-chars"}'
   ```
   - Make sure the key matches your `.env.local` JWT_SECRET

## How It Works

### Token Generation

When a user logs in or registers:

1. Credentials are verified using admin secret
2. A JWT token is generated with Hasura-specific claims:
   ```json
   {
     "https://hasura.io/jwt/claims": {
       "x-hasura-allowed-roles": ["user", "admin"],
       "x-hasura-default-role": "user",
       "x-hasura-user-id": "uuid",
       "x-hasura-role-id": "uuid"
     }
   }
   ```
3. Token is stored in sessionStorage and automatically sent with GraphQL requests

### Token Validation

- Tokens expire after 7 days
- Client-side validation checks expiration before requests
- Hasura validates token signature on every request
- Invalid/expired tokens trigger re-authentication

### Using Authenticated Requests

```typescript
import { createAuthenticatedClient } from "~/graphql/client";
import { getAuthToken } from "~/utils/auth";

const token = getAuthToken();
if (token) {
  const client = createAuthenticatedClient(token);
  const data = await client.request(QUERY, variables);
}
```

## Row Level Security (RLS)

With JWT claims, you can now use Hasura permissions based on:

- `x-hasura-user-id`: Restrict data to current user
- `x-hasura-default-role`: Apply role-based access control
- `x-hasura-role-id`: Custom role-based filtering

Example permission in Hasura:

```json
{
  "user_id": {
    "_eq": "X-Hasura-User-Id"
  }
}
```

## Security Notes

- Never expose JWT_SECRET in client code
- Use environment variables for secrets
- Tokens are httpOnly in production (when using server-side auth)
- Implement refresh token rotation for long-lived sessions
