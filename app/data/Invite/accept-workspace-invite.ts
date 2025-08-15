'use server'

import { db } from "@/lib/db";
import { userRequired } from "../user/is-user-authenticated";

export const acceptWorkspaceInvite = async (workspaceId: string) => {
  const { user } = await userRequired();

  // check if already a member
  const existingMember = await db.workspaceMember.findFirst({
    where: { workspaceId, userId: user.id },
  });

  if (existingMember) {
    return { success: true, alreadyMember: true };
  };

  await db.workspaceMember.create({
    data: {
      workspaceId,
      userId: user.id,
      accessLevel: "MEMBER",
    },
  });
};
