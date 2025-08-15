import { getWorkspaceMembers } from "@/app/data/member/get-workspace-members";
import { AddMemberForm } from '@/components/members/add-members-form';
import { MembersList } from '@/components/members/members-list';
import React from 'react'

interface pageprops {
    params: Promise<{ workspaceId: string }>
}

const members = async (props: pageprops) => {
    const { workspaceId } = await props.params
    const workspaceMembers = await getWorkspaceMembers(workspaceId);
  return (
    <div className='p-6 space-y-6'>
        <h1 className='text-2xl font-bold'>Workspace Members</h1>
        <AddMemberForm workspaceId={workspaceId} />
        <MembersList members={workspaceMembers ?? []} workspaceId={workspaceId} />
    </div>
  )
}

export default members