import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { admin as adminPlugin } from "better-auth/plugins";
import { ac, admin, superuser, system_user } from "@/lib/auth/permissions";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
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