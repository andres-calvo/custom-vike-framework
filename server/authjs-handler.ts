import {
  Auth,
  createActionURL,
  setEnvDefaults,
  type AuthConfig,
} from "@auth/core";
import Auth0 from "@auth/core/providers/auth0";
import type { Session } from "@auth/core/types";

const env: Record<string, string | undefined> =
  typeof process?.env !== "undefined"
    ? process.env
    : import.meta && "env" in import.meta
    ? (
        import.meta as ImportMeta & {
          env: Record<string, string | undefined>;
        }
      ).env
    : {};

if (!globalThis.crypto) {
  /**
   * Polyfill needed if Auth.js code runs on node18
   */
  Object.defineProperty(globalThis, "crypto", {
    value: await import("node:crypto").then(
      (crypto) => crypto.webcrypto as Crypto
    ),
    writable: false,
    configurable: true,
  });
}

const authjsConfig = {
  basePath: "/api/auth",
  trustHost: Boolean(
    env.AUTH_TRUST_HOST ?? env.VERCEL ?? env.NODE_ENV !== "production"
  ),
  // TODO: Replace secret {@see https://authjs.dev/reference/core#secret}
  secret: env.AUTH_SECRET,
  providers: [
    Auth0({
      issuer: env.AUTH0_ISSUER_BASE_URL,
      clientId: env.AUTH0_CLIENT_ID,
      clientSecret: env.AUTH0_CLIENT_SECRET,
    }),
  ],
} satisfies Omit<AuthConfig, "raw">;

/**
 * Retrieve Auth.js session from Request
 */
export async function getSession(
  req: Request,
  config: Omit<AuthConfig, "raw">
): Promise<Session | null> {
  setEnvDefaults(process.env, config);
  const requestURL = new URL(req.url);
  const url = createActionURL(
    "session",
    requestURL.protocol,
    req.headers,
    process.env,
    config.basePath
  );

  const response = await Auth(
    new Request(url, { headers: { cookie: req.headers.get("cookie") ?? "" } }),
    config
  );

  const { status = 200 } = response;

  const data = await response.json();

  if (!data || !Object.keys(data).length) return null;
  if (status === 200) return data;
  throw new Error(data.message);
}

/**
 * Add Auth.js session to context
 * @link {@see https://authjs.dev/getting-started/session-management/get-session}
 **/
export async function authjsSessionMiddleware(
  request: Request,
  context: Record<string | number | symbol, unknown>
): Promise<void> {
  try {
    context.session = await getSession(request, authjsConfig);
  } catch (error) {
    console.debug("authjsSessionMiddleware:", error);
    context.user = null;
  }
}

/**
 * Auth.js route
 * @link {@see https://authjs.dev/getting-started/installation}
 **/
export function authjsHandler<
  Context extends Record<string | number | symbol, unknown>
>(request: Request, _context?: Context): Promise<Response> {
  return Auth(request, authjsConfig);
}
