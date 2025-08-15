"use client";

import { ProjectProps } from "@/lib/types";
import { File, Task, User } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ProjectAvatar } from "../project/project-avatar";
import { ProfileAvatar } from "../profile-avatar";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { format } from "date-fns";

import { EditTaskDialog } from "./edit-task-dialog";
import { formatName } from "@/utils/format-name";


interface TaskProps {
  task: Task & {
    assignedTo: User;
    project: ProjectProps;
    attachments: File[];
  };
}
 
export const TaskDetails = ({ task }: TaskProps) => {
  return (
    <Card className="shadow-xl border border-muted w-full">
      <CardHeader className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <div>
          <CardTitle className="text-2xl font-semibold">{task.title}</CardTitle>
          <div className="flex items-center gap-2 mt-2">
            <ProjectAvatar name={task.project.name} />
            <p className="text-base text-muted-foreground">
              {task.project.name}
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3 items-end md:items-center">
          <EditTaskDialog
            key={new Date().getTime()}
            task={task}
            project={task.project}
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Assigned to:</span>
            <ProfileAvatar
              url={task.assignedTo.image || undefined}
              name={task.assignedTo.name}
            />
            <span className="text-sm font-medium">
              {formatName(task.assignedTo.name)}
            </span>
          </div>
        </div>
      </CardHeader>

      <Separator className="my-3" />

      <CardContent className="space-y-8">
        <div>
          <h4 className="text-lg font-medium mb-1">Description</h4>
          <p className="text-muted-foreground">
            {task.description || "No description provided."}
          </p>
        </div>

        <div>
          <h4 className="text-lg font-medium mb-3">Additional Details</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              <Badge variant={task.status}>{task.status}</Badge>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Due Date</p>
              <p className="font-medium">
                {format(task.dueDate, "MMM d, yyyy")}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Priority</p>
              <Badge variant={task.priority}>{task.priority}</Badge>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};
