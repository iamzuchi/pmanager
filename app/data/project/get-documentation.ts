'use server'

import { db } from "@/lib/db";
import { userRequired } from "@/app/data/user/is-user-authenticated";

export const getDocumentation = async (projectId: string) => {
  const { user } = await userRequired();

  const documentation = await db.documentation.findFirst({
    where: { 
        projectId,
    },
  });

  return documentation;
};

export const updateDocumentation = async (projectId: string, content: string) => {
  const { user } = await userRequired();

  const existingDoc = await db.documentation.findUnique({
    where: { projectId },
  });

  if (existingDoc) {
    await db.documentation.update({
      where: { projectId },
      data: { content, updatedBy: user.id },
    });
  } else {
    await db.documentation.create({
      data: { projectId, content, updatedBy: user.id },
    });
  }

  return { success: true };
};
