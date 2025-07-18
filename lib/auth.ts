import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "@/lib/db";
import { admin as adminPlugin } from "better-auth/plugins";
import { ac, admin, superuser, system_user } from "@/lib/auth/permissions";


export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true
  },
  plugins: [
    adminPlugin({
      ac,
      roles: {
        superuser,
        admin,
        system_user,
      },
      adminRoles: ["superuser", "admin"],
      defaultRole: "system_user",
    }),
  ],
});