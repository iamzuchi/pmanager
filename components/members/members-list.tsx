"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { removeWorkspaceMember } from "@/app/data/member/remove-member";
import { $Enums } from "@prisma/client";

interface MembersListProps {
  members: {
    id: string;
    user: {
      name: string;
      email: string;
    };
    accessLevel: $Enums.AccessLevel;
  }[];
  workspaceId: string;
}

export const MembersList = ({ members, workspaceId }: MembersListProps) => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleRemove = async (id: string) => {
    setLoading(id);
    try {
      await removeWorkspaceMember(workspaceId, id);
      window.location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-3">
      {members.map((member) => (
        <div
          key={member.id}
          className="flex items-center justify-between border p-2 rounded"
        >
          <div>
            <p className="font-medium">{member.user.name}</p>
            <p className="text-sm text-muted-foreground">{member.user.email}</p>
            <p className="text-xs italic text-gray-500">{member.accessLevel}</p>
          </div>

          {/* Disable remove button for OWNER */}
          {member.accessLevel !== "OWNER" && (
            <Button
              variant="destructive"
              size="sm"
              disabled={loading === member.id}
              onClick={() => handleRemove(member.id)}
            >
              {loading === member.id ? "Removing..." : "Remove"}
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};
