
'use client'
import React from 'react'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart2, Users, ListChecks, CheckCircle, FolderOpen } from "lucide-react";
import { format } from 'date-fns/format';
import { TaskStatus } from '@prisma/client';
import TasksByStatusCard from '@/components/task/task-status-card';

interface DashboardProps {
  projects?: any[];
  workspaceMembers?: any[];
  tasks?: any[];
}
 
export const Dashboard = ({ projects, workspaceMembers, tasks }: DashboardProps) => {
  
  
  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-4">
            <FolderOpen className="text-blue-600 mb-2" />
            <p className="text-sm">Total Projects</p>
            <h2 className="text-xl font-bold">{projects?.length ?? 0}</h2>
          </CardContent>
        </Card>
        <Card>
  <CardContent className="flex flex-col items-center justify-center p-4">
    <ListChecks className="text-yellow-600 mb-2" />
    <p className="text-sm">Total Tasks</p>
    <h2 className="text-xl font-bold">{tasks?.length}</h2>
  </CardContent>
</Card>
<Card>
  <CardContent className="flex flex-col items-center justify-center p-4">
    <BarChart2 className="text-purple-600 mb-2" />
    <p className="text-sm">My Tasks</p>
    <h2 className="text-xl font-bold">{ tasks?.filter((task) => task.assigneeId).length}</h2>
  </CardContent>
</Card>  
<Card>
  <CardContent className="flex flex-col items-center justify-center p-4">
    <CheckCircle className="text-green-600 mb-2" />
    <p className="text-sm">Completed Tasks</p>
    <h2 className="text-xl font-bold">{tasks?.filter((task) => task.status === "COMPLETED").length}</h2>
  </CardContent>
</Card>

        <Card>
          <CardContent className="flex flex-col items-center justify-center p-4">
            <Users className="text-pink-600 mb-2" />
            <p className="text-sm">Team Members</p>
            <h2 className="text-xl font-bold">{workspaceMembers?.length ?? 0}</h2>
          </CardContent>
        </Card>
      </div>

      {/* Middle Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <TasksByStatusCard tasks={tasks ?? []}/>

        <Card>
          <CardHeader>
            <CardTitle>Task Creation Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Task creation trend (last 7 days)</p>
            {/* Placeholder for chart */}
            <div className="h-32 bg-muted rounded-lg flex items-center justify-center">Chart</div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Members</CardTitle>
          </CardHeader>
          <CardContent>
          {workspaceMembers?.length ? (
            workspaceMembers.map((member: any) => (
              <div key={member.id} className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{member.user.name}</p>
                  <p className="text-sm text-muted-foreground">{member.user.email}</p>
                </div>
                <p className="text-xs"></p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No members found</p>
          )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {projects?.length
              ? projects.map((project: any) => (
                  <p key={project.id} className="text-sm font-medium">{project.name}</p>
                ))
              : <p className="text-sm text-muted-foreground">No recent projects</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


