export interface Task {
  id: string;
  name: string;
  duration: number;
  dependencies: string[];
}

export interface ScheduledTask {
  id: string;
  name: string;
  duration: number;
  dependencies: string[];
  earliestStart: number;
  earliestFinish: number;
  latestStart: number;
  latestFinish: number;
  float: number;
  isCritical: boolean;
}

export interface CpmResult {
  scheduledTasks: ScheduledTask[];
  topologicalOrder: string[];
  criticalPath: string[];
  projectDuration: number;
  steps: string[];
}

export interface CpmError {
  message: string;
  cycleDetected?: boolean;
}
