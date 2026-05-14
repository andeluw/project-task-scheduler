'use client';

import { Plus, RotateCcw, Trash2 } from 'lucide-react';
import * as React from 'react';
import {
  FormProvider,
  useFieldArray,
  useForm,
  useWatch,
} from 'react-hook-form';

import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Typography } from '@/components/typography';

import { Task } from '@/types/task';

interface TaskTableFormValues {
  tasks: TaskFormRow[];
}

interface TaskFormRow {
  id: string;
  name: string;
  duration: number;
  dependencies: string;
}

interface TaskTableProps {
  tasks: Task[];
  onChange: (tasks: Task[]) => void;
  onCalculate: (tasks: Task[]) => void;
  onReset: () => void;
  error: string | null;
}

function toFormRows(tasks: Task[]): TaskFormRow[] {
  return tasks.map((task) => ({
    ...task,
    dependencies: task.dependencies.join(', '),
  }));
}

function parseDependencies(raw: string): string[] {
  return raw
    .split(',')
    .map((dependency) => dependency.trim().toUpperCase())
    .filter(Boolean);
}

function toTasks(rows: TaskFormRow[] = []): Task[] {
  return rows.map((row) => ({
    id: row.id.trim().toUpperCase(),
    name: row.name,
    duration: Math.max(0, Number(row.duration) || 0),
    dependencies: parseDependencies(row.dependencies),
  }));
}

function isSameTasks(a: Task[], b: Task[]) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function TaskTable({
  tasks,
  onChange,
  onCalculate,
  onReset,
  error,
}: TaskTableProps) {
  const methods = useForm<TaskTableFormValues>({
    defaultValues: { tasks: toFormRows(tasks) },
  });

  const { control, getValues, reset } = methods;
  const { append, fields, replace } = useFieldArray({
    control,
    name: 'tasks',
    keyName: 'fieldKey',
  });

  const watchedRows = useWatch({ control, name: 'tasks' });

  React.useEffect(() => {
    const nextTasks = toTasks(watchedRows);

    if (!isSameTasks(nextTasks, tasks)) {
      onChange(nextTasks);
    }
  }, [onChange, tasks, watchedRows]);

  React.useEffect(() => {
    const currentTasks = toTasks(getValues('tasks'));

    if (!isSameTasks(currentTasks, tasks)) {
      reset({ tasks: toFormRows(tasks) });
    }
  }, [getValues, reset, tasks]);

  function deleteTask(index: number) {
    const rows = getValues('tasks');
    const removedId = rows[index]?.id.trim().toUpperCase() ?? '';
    const nextRows = rows
      .filter((_, i) => i !== index)
      .map((row) => ({
        ...row,
        dependencies: parseDependencies(row.dependencies)
          .filter((dependency) => dependency !== removedId)
          .join(', '),
      }));

    replace(nextRows);
    onChange(toTasks(nextRows));
  }

  function addTask() {
    const currentRows = getValues('tasks');
    const used = new Set(currentRows.map((task) => task.id.toUpperCase()));
    let id = '';

    for (let code = 65; code <= 90; code++) {
      const candidate = String.fromCharCode(code);
      if (!used.has(candidate)) {
        id = candidate;
        break;
      }
    }

    if (!id) {
      let n = 1;
      while (used.has(`T${n}`)) n++;
      id = `T${n}`;
    }

    append({ id, name: '', duration: 1, dependencies: '' });
  }

  function calculateSchedule() {
    onCalculate(toTasks(getValues('tasks')));
  }

  return (
    <FormProvider {...methods}>
      <div className='space-y-4'>
        <div className='overflow-x-auto rounded-lg border border-border'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b border-border bg-muted/50'>
                <th className='px-3 py-2 text-left font-semibold text-muted-foreground'>
                  ID
                </th>
                <th className='px-3 py-2 text-left font-semibold text-muted-foreground'>
                  Task Name
                </th>
                <th className='px-3 py-2 text-left font-semibold text-muted-foreground'>
                  Duration (days)
                </th>
                <th className='px-3 py-2 text-left font-semibold text-muted-foreground'>
                  Dependencies (comma-separated IDs)
                </th>
                <th className='px-3 py-2 text-center font-semibold text-muted-foreground'>
                  Del
                </th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr
                  key={field.fieldKey}
                  className='border-b border-border last:border-0 hover:bg-muted/20'
                >
                  <td className='px-3 py-2'>
                    <div className='w-16'>
                      <Input
                        id={`tasks.${index}.id`}
                        hideError
                        placeholder='A'
                        className='h-8 font-mono font-semibold uppercase'
                        validation={{ required: 'Task ID is required' }}
                      />
                    </div>
                  </td>

                  <td className='px-3 py-2'>
                    <div className='min-w-[180px]'>
                      <Input
                        id={`tasks.${index}.name`}
                        hideError
                        placeholder='Task name'
                        className='h-8'
                      />
                    </div>
                  </td>

                  <td className='px-3 py-2'>
                    <div className='w-24'>
                      <Input
                        id={`tasks.${index}.duration`}
                        hideError
                        type='number'
                        min={0}
                        className='h-8'
                        validation={{
                          min: {
                            value: 0,
                            message: 'Duration cannot be negative',
                          },
                          valueAsNumber: true,
                        }}
                      />
                    </div>
                  </td>

                  <td className='px-3 py-2'>
                    <div className='min-w-[200px]'>
                      <Input
                        id={`tasks.${index}.dependencies`}
                        hideError
                        placeholder='A, B'
                        className='h-8'
                      />
                    </div>
                  </td>

                  <td className='px-3 py-2 text-center'>
                    <button
                      type='button'
                      onClick={() => deleteTask(index)}
                      className='inline-flex items-center justify-center rounded p-1 text-muted-foreground hover:bg-red-50 hover:text-red-500'
                      title='Delete task'
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}

              {fields.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className='px-3 py-6 text-center text-muted-foreground'
                  >
                    <Typography variant='b3' color='secondary'>
                      No tasks yet. Click "+ Add Task" to begin.
                    </Typography>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {error && (
          <Typography
            variant='b3'
            className='rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700'
          >
            {error}
          </Typography>
        )}

        <div className='flex flex-wrap gap-3'>
          <Button variant='outline' size='sm' leftIcon={Plus} onClick={addTask}>
            Add Task
          </Button>
          <Button
            variant='light'
            size='sm'
            leftIcon={RotateCcw}
            onClick={onReset}
          >
            Reset Sample Data
          </Button>
          <Button size='sm' onClick={calculateSchedule} className='ml-auto'>
            Calculate Schedule
          </Button>
        </div>
      </div>
    </FormProvider>
  );
}
