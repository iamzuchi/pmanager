"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { addWorkspaceMember } from "@/app/data/member/add-member";

export const AddMemberForm = ({ workspaceId }: { workspaceId: string }) => {
  const [email, setEmail] = useState("");
  const [accessLevel, setAccessLevel] = useState("MEMBER");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    try {
      await addWorkspaceMember(workspaceId, email, accessLevel);
      window.location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="User email"
        className="border p-2 rounded"
      />
      <select value={accessLevel} onChange={(e) => setAccessLevel(e.target.value)} className="border p-2 rounded">
        <option value="MEMBER">Member</option>
        <option value="ADMIN">Admin</option>
      </select>
      <Button disabled={loading} onClick={handleAdd}>
        {loading ? "Adding..." : "Add Member"}
      </Button>
    </div>
  );
};
