'use server'

import { db } from "@/lib/db";

export const getInviteDetails = async (workspaceId: string, inviteCode: string) => {
  const workspace = await db.workspace.findFirst({
    where: {
      id: workspaceId,
      inviteCode: inviteCode,
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (!workspace) return null;

  return {
    workspaceId: workspace.id,
    workspaceName: workspace.name,
  };
};
