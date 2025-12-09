import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import { env } from "../config/env";
import { openAPI } from "better-auth/plugins"
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
  }),
  emailAndPassword: {
    enabled: true,
  },
  onAPIError: {
    throw: true,
    onError: (e) => {
        console.log("BETTER AUTH API ERROR", e);
    }
  },
  plugins: [ 
        openAPI(), 
    ] ,
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: [env.BETTER_AUTH_URL, "http://localhost:4000"],
});
