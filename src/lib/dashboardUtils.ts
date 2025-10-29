import { supabase } from '@/integrations/supabase/client';
import type { RealTask } from '@/types/dashboard';

export const handleBulkActions = async (
  action: 'complete' | 'delete',
  taskIds: string[]
): Promise<{ error: Error | null }> => {
  if (taskIds.length === 0) return { error: null };

  let error;
  if (action === 'delete') {
    ({ error } = await supabase.from('tasks').delete().in('id', taskIds));
  } else if (action === 'complete') {
    ({ error } = await supabase.from('tasks').update({ status: 'completed' }).in('id', taskIds));
  }

  if (error) {
    console.error(`Error performing bulk action (${action}):`, error);
    return { error: error as Error };
  }
  return { error: null };
};

export const handleExportSelected = (
  taskIds: string[],
  allTasks: RealTask[]
): void => {
  if (!allTasks || taskIds.length === 0) return;
  const tasksToExport = allTasks.filter(task => taskIds.includes(task.id));
  
  const headers = ['id', 'title', 'description', 'status', 'priority', 'due_date', 'created_at'];
  const csvRows = [
      headers.join(','),
      ...tasksToExport.map(task => 
          headers.map(header => {
              const value = task[header as keyof RealTask] || '';
              const escaped = String(value).replace(/"/g, '""');
              return `"${escaped}"`;
          }).join(',')
      )
  ];
  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `gyanvedu_tasks_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};