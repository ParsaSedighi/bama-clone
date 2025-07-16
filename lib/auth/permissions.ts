import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";


const statement = {
    ...defaultStatements,
    advertisement: ["create", "delete"],
} as const;

export const ac = createAccessControl(statement);


// SYSTEM_USER: Can create advertisements.
export const system_user = ac.newRole({
    advertisement: ["create"],
});

// ADMIN: Can do everything a user can, plus delete ads and ban users.
export const admin = ac.newRole({
    ...system_user.statements, // Inherits SYSTEM_USER permissions
    advertisement: ["delete"],
    user: ["ban", "list"], // From defaultStatements
});

// SUPERUSER: Has all permissions defined in the statement.
export const superuser = ac.newRole({
    ...adminAc.statements, // Gets all default admin permissions from better-auth
    advertisement: ["create", "delete"],
});