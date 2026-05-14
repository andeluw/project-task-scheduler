import { Task } from '@/types/task';

export const sampleTasks: Task[] = [
  { id: 'A', name: 'Requirements', duration: 3, dependencies: [] },
  { id: 'B', name: 'UI Design', duration: 4, dependencies: ['A'] },
  { id: 'C', name: 'DB Design', duration: 3, dependencies: ['A'] },
  { id: 'D', name: 'Backend Dev', duration: 7, dependencies: ['C'] },
  { id: 'E', name: 'Frontend Dev', duration: 5, dependencies: ['B'] },
  { id: 'F', name: 'API Integration', duration: 3, dependencies: ['D', 'E'] },
  { id: 'G', name: 'Testing', duration: 4, dependencies: ['F'] },
  { id: 'H', name: 'Deployment', duration: 2, dependencies: ['G'] },
  { id: 'I', name: 'Documentation', duration: 3, dependencies: ['A'] },
  { id: 'J', name: 'Final Review', duration: 1, dependencies: ['H', 'I'] },
];
