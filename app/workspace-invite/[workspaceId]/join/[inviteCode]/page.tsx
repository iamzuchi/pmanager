import { getInviteDetails } from "@/app/data/Invite/get-invite-details";
import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";
import { acceptWorkspaceInvite } from "@/app/data/Invite/accept-workspace-invite";

interface PageProps {
   params: Promise<{ workspaceId: string; inviteCode: string }>;
}

export default async function InvitePage({ params }: PageProps) {
  const { workspaceId, inviteCode } = await params;

  // Get the invite info
  const invite = await getInviteDetails(workspaceId, inviteCode);
  if (!invite) {
    // optionally redirect or show error page
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <XCircle className="text-red-500 w-12 h-12 mx-auto" />
            <CardTitle className="text-destructive">Invalid Invite</CardTitle>
            <CardDescription>This invite link has expired or is invalid.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button variant="outline" className="w-full">Return Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { isAuthenticated } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();

  // If already logged in, maybe auto-join workspace or redirect to dashboard
  if (isUserAuthenticated) {
    await acceptWorkspaceInvite(workspaceId)
    // optionally add logic to accept invite and redirect
    redirect(`/workspace/${workspaceId}`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CheckCircle className="text-green-500 w-12 h-12 mx-auto" />
          <CardTitle className="text-center">{"You've been invited!"}</CardTitle>
          <CardDescription className="text-center">
            Join <span className="font-semibold">{invite.workspaceName}</span> workspace.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <Link href="/api/auth/login">
            <Button size="lg" className="w-full">Login to Accept Invite</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
