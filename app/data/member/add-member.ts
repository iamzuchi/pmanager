'use server'
import { db } from "@/lib/db";
import { userRequired } from "../user/is-user-authenticated"
import { AccessLevel } from "@prisma/client";

export const addWorkspaceMember = async (workspaceId: string, userEmail: string, accessLevel: string) =>{
    const { user } = await userRequired();

    const owner = await db.workspaceMember.findUnique({
        where: {
            userId_workspaceId: { userId: user.id, workspaceId },
        },
    });

    if (!owner || owner.accessLevel !== "OWNER") {
        throw new Error("Only workspace owners can add members. ");
    }

    const invitedUser = await db.user.findUnique({
        where: { email: userEmail },
    });

    if (!invitedUser) {
        throw new Error("User not found.");
    }

    if (!Object.values(AccessLevel).includes(accessLevel as AccessLevel)) {
       throw new Error("Invalid access level provided");
    }

    await db.workspaceMember.create({
        data: {
            userId: invitedUser.id,
            workspaceId,
            accessLevel: accessLevel as AccessLevel,
        },
    });

    return { success: true };
}