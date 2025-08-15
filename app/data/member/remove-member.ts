'use server'
import { db } from "@/lib/db";
import { userRequired } from "../user/is-user-authenticated"

export const removeWorkspaceMember = async (workspaceId: string, memberId: string) => {
    const { user } = await userRequired();

    const owner = await db.workspaceMember.findUnique({
        where: {
            userId_workspaceId: { userId: user.id, workspaceId },
        },
    });

    if (!owner || owner.accessLevel !== "OWNER") {
        throw new Error("Only workspace owners can remove members.");
    }

    await db.workspaceMember.delete({
        where: { id: memberId },
    });

    return { success: true };
}