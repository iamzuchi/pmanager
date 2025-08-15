"use client";

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { projectSchema} from "@/lib/schema";
import { WorkspaceMembersProps } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Plus } from "lucide-react";
import { Card } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { toast } from "sonner";
import { createNewProject } from "@/app/actions/project";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { projectPhaseStats } from "@/utils";

interface Props {
  workspaceMembers: WorkspaceMembersProps[];
}

export type ProjectDataType = z.infer<typeof projectSchema>;

export const CreateProjectForm = ({ workspaceMembers }: Props) => {
  const workspaceId = useWorkspaceId();
  const [pending, setPending] = useState(false);
  const router = useRouter();

   const form = useForm<ProjectDataType>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      phase: "OPEN",
      workspaceId: workspaceId as string,
      memberAccess: [],
    },
  });

  const handleSubmit = async(data: ProjectDataType) => {
    try{
        setPending(true)

        const result = await createNewProject(data);
        form.reset();
        if (!result.success) {
            toast.error(result.error || "Failed to create project");
        }

        toast.success("Project created successfully")
        router.refresh()
    } catch (error) {
        console.log(error);

        toast.error("Something went wrong");
    }finally {
        setPending(false)
    }
  };

  return (
    <>
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" className="size-5">
            <Plus/>
        </Button>
      </DialogTrigger> 
        <DialogContent>
        <Card className="w-full max-w-md">
      <DialogHeader>
        <DialogTitle>Create New Project</DialogTitle>
      </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter project name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Project description" className="resize-none" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
              {/* className="border p-2 rounded w-full" */}
            <FormField 
              control={form.control}
              name="phase"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phase</FormLabel>
                  <Select {...field} 
                   onValueChange={field.onChange}
                   defaultValue={field.value}
                   >
                  <FormControl>
                    <SelectTrigger>
                    <SelectValue placeholder="Select Project Phase" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                  {/* ProjectPhaseEnum.options */}
                      {projectPhaseStats.map((phase) => (
                        <SelectItem key={phase.phase} value={phase.phase}>
                          {phase.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
                <FormField 
                 control={form.control}

                 name="memberAccess"
                 render={({field})=>(
                    <FormItem>
                        <FormLabel>Project Access</FormLabel>
                        <FormDescription>
                            Select Which Workspace members should have access to this Project
                        </FormDescription>

                        <div>
                            {
                                workspaceMembers?.map((member)=> (
                                    <div key={member.userId} className="flex items-center space-x-2">
                                        <Checkbox 
                                        id={member.userId}
                                        checked={field.value?.includes(member.userId)}
                                        onCheckedChange={(checked)=>{
                                            const currentValue = field.value || [];
                                            if (checked) {
                                                field.onChange([
                                                    ...currentValue,
                                                    member.userId,
                                                ]);
                                            }else {
                                                field.onChange(
                                                    currentValue.filter(
                                                        (id) => id !== member.userId
                                                    )
                                                );
                                            }
                                        }}
                                        />

                                        <label htmlFor={member.userId} className="text-sm font-medium leading-none
                                        peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize cursor-pointer"
                                        >
                                         {member.user.name}
                                         ({member.accessLevel.toLocaleLowerCase()})
                                        </label>
                                    </div>
                                ))
                            }
                        </div>
                    </FormItem>
                 )}
                />
            </div>

            <div className="flex flex-row items-center gap-4">
              <Button
                type="button"
                variant={"outline"}
                disabled={pending}
                onClick={() => form.reset()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={pending}>
                Create Project
              </Button>
            </div>
          </form>
        </Form>
    </Card>
        </DialogContent>
    </Dialog>
    </>
  );
};

export default CreateProjectForm;
