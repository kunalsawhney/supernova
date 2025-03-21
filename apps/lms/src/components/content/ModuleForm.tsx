'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CourseStatus } from '@/types/course';
import { useToast } from '@/hooks/use-toast';
import { courseWizardService } from '@/services/courseWizardService';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ModuleData } from './ModuleCard';

// Form schema
const moduleSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived'] as const),
  duration_weeks: z.coerce.number().min(0).optional(),
  is_mandatory: z.boolean().default(true),
  sequence_number: z.coerce.number().min(1).default(1),
});

type ModuleFormValues = z.infer<typeof moduleSchema>;

interface ModuleFormProps {
  module?: ModuleData;
  courseId: string;
  contentId: string;
  onSuccess?: (moduleId: string) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

export function ModuleForm({
  module,
  courseId,
  contentId, 
  onSuccess,
  onCancel,
  isEditing = false,
}: ModuleFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with module data or defaults
  const form = useForm<ModuleFormValues>({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      title: module?.title || '',
      description: module?.description || '',
      status: (module?.status as CourseStatus) || 'draft',
      duration_weeks: module?.duration_weeks || 0,
      is_mandatory: module?.is_mandatory ?? true,
      sequence_number: module?.sequence_number || 1,
    },
  });

  const onSubmit = async (values: ModuleFormValues) => {
    setIsSubmitting(true);
    try {
      if (isEditing && module?.id) {
        // Update existing module
        await courseWizardService.updateModule(module.id, values);
        toast({
          title: 'Success',
          description: 'Module updated successfully',
        });
      } else {
        // Create new module
        const response = await courseWizardService.addModule(contentId, values);
        toast({
          title: 'Success',
          description: 'Module created successfully',
        });
        
        // Call onSuccess with the new module ID
        if (onSuccess && response.id) {
          onSuccess(response.id);
        }
      }
      
      // Navigate back to modules page or call onSuccess
      if (!onSuccess) {
        router.push(`/dashboard/admin/content-v2/modules?courseId=${courseId}`);
      }
    } catch (error) {
      console.error('Failed to save module:', error);
      toast({
        title: 'Error',
        description: isEditing 
          ? 'Failed to update module' 
          : 'Failed to create module',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Module' : 'Create New Module'}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter module title" {...field} />
                  </FormControl>
                  <FormDescription>
                    The title will be displayed in the course structure.
                  </FormDescription>
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
                    <Textarea 
                      placeholder="Enter module description" 
                      className="min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a brief description of what this module covers.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Set the current status of this module.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration_weeks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (weeks)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="1" 
                        placeholder="Enter duration in weeks" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Estimated time to complete this module.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="sequence_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sequence Number</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        step="1" 
                        placeholder="Enter sequence number" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Order in which this module appears.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_mandatory"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Mandatory
                      </FormLabel>
                      <FormDescription>
                        Require students to complete this module.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel || (() => router.back())}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="mr-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                  </span>
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditing ? 'Update Module' : 'Create Module'
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
} 