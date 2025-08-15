'use server'

import { db } from "@/lib/db";

export const getWorkspaceByInviteCode = async (workspaceId: string, inviteCode: string) => {
  return await db.workspace.findFirst({
    where: {
      id: workspaceId,
      inviteCode
    }
  });
};
