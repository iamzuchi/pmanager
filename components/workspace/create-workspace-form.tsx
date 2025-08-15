"use client"
import { workspaceSchema } from '@/lib/schema';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver} from "@hookform/resolvers/zod"
import { z } from 'zod';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { createNewWorkspace } from '@/app/actions/workspace';
import { useRouter } from 'next/navigation';



export type CreateWorkspaceDataType = z.infer<typeof workspaceSchema>
export const CreateWorkspaceForm = () => {
  const [pending, setPending] = useState(false);
  const router = useRouter()

  const form = useForm<CreateWorkspaceDataType>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
        name: "",
        description: "",
    },
  });

const onSubmit = async (data: CreateWorkspaceDataType) => {
  try {
    setPending(true);
    const res = await createNewWorkspace(data);

    toast.success("Workspace created successfully");

    // Since createNewWorkspace only returns a workspace on success
    router.push(`/workspace/${res.id}`);
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong. Try again.");
  } finally {
    setPending(false);
  }
}
 
  return (
    <div className='min-h-screen flex items-center justify-center bg-background'>
        <Card className='w-full max-w-md'>
            <CardHeader>
                <CardTitle>Create New Workspace</CardTitle>
                <CardDescription>Set up a workspace for yourself and team</CardDescription>
            </CardHeader>

            <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
                <FormField
                control={form.control}
                name='name'
                render={({field})=>(
                  <FormItem>
                    <FormLabel>Workspace Name</FormLabel>
                    <FormControl>
                        <Input placeholder='Enter workspace name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>  
                )}
                />


                <FormField
                control={form.control}
                name='description'
                render={({field})=>(
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                        <Textarea 
                        {...field} 
                        placeholder='Workspace description' 
                        className='resize-none'>
                        
                        </Textarea>
                    </FormControl>
                  </FormItem>  
                )}
                />

              <div className='flex flex-row items-center gap-4'>
              <Button type='button' variant={'outline'} disabled={pending}>
                  Cancel   
                </Button>
                <Button type='submit' disabled={pending} className=''>
                  Create Workspace 
                </Button>
              </div>
            </form>
            </Form>
            </CardContent>
        </Card>    
    </div>
  )
};

export default CreateWorkspaceForm;