import { sentryVitePlugin } from "@sentry/vite-plugin";
import ssr from "vike/plugin";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [
      react({}),
      ssr({}),
      sentryVitePlugin({
        org: "andres-calvo",
        project: "javascript-react",
        authToken: env.SENTRY_AUTH_TOKEN,
        disable: mode === "development",
      }),
    ],

    build: {
      sourcemap: true,
    },
  };
});
