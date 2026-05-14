import { CpmError, CpmResult, ScheduledTask, Task } from '@/types/task';

function validateTasks(tasks: Task[]): CpmError | null {
  const ids = new Set<string>();

  for (const task of tasks) {
    if (!task.id.trim()) {
      return { message: 'Every task must have a non-empty ID.' };
    }
    if (ids.has(task.id)) {
      return {
        message: `Duplicate task ID "${task.id}". All IDs must be unique.`,
      };
    }
    ids.add(task.id);

    if (task.duration < 0) {
      return {
        message: `Task "${task.id}" has a negative duration. Duration must be ≥ 0.`,
      };
    }

    const depSet = new Set<string>();
    for (const dep of task.dependencies) {
      if (depSet.has(dep)) {
        return {
          message: `Task "${task.id}" has duplicate dependency "${dep}".`,
        };
      }
      depSet.add(dep);
    }
  }

  for (const task of tasks) {
    for (const dep of task.dependencies) {
      if (!ids.has(dep)) {
        return {
          message: `Task "${task.id}" references unknown dependency "${dep}". Add that task first.`,
        };
      }
      if (dep === task.id) {
        return { message: `Task "${task.id}" cannot depend on itself.` };
      }
    }
  }

  return null;
}

function buildGraph(tasks: Task[]): {
  adjList: Map<string, string[]>;
  inDegree: Map<string, number>;
} {
  const adjList = new Map<string, string[]>();
  const inDegree = new Map<string, number>();

  for (const task of tasks) {
    adjList.set(task.id, []);
    inDegree.set(task.id, 0);
  }

  for (const task of tasks) {
    for (const dep of task.dependencies) {
      adjList.get(dep)!.push(task.id);
      inDegree.set(task.id, (inDegree.get(task.id) ?? 0) + 1);
    }
  }

  return { adjList, inDegree };
}

function kahnTopologicalSort(
  tasks: Task[],
  adjList: Map<string, string[]>,
  inDegree: Map<string, number>,
  steps: string[],
): { order: string[]; hasCycle: boolean } {
  const deg = new Map(inDegree);

  const queue: string[] = [];
  for (const [id, d] of deg) {
    if (d === 0) queue.push(id);
  }

  steps.push(
    `[Kahn's] Initial queue (tasks with no dependencies): [${queue.join(', ')}]`,
  );

  const order: string[] = [];

  while (queue.length > 0) {
    const current = queue.shift()!;
    order.push(current);

    for (const neighbor of adjList.get(current) ?? []) {
      const newDeg = (deg.get(neighbor) ?? 0) - 1;
      deg.set(neighbor, newDeg);
      if (newDeg === 0) {
        queue.push(neighbor);
        steps.push(
          `[Kahn's] Processed "${current}" → in-degree of "${neighbor}" dropped to 0, enqueued.`,
        );
      }
    }
  }

  const hasCycle = order.length !== tasks.length;

  if (hasCycle) {
    steps.push(
      `[Cycle Detection] Only ${order.length} of ${tasks.length} tasks processed — cycle detected!`,
    );
  } else {
    steps.push(`[Kahn's] Topological order complete: ${order.join(' → ')}`);
  }

  return { order, hasCycle };
}

function forwardPass(
  tasks: Task[],
  topologicalOrder: string[],
  taskMap: Map<string, Task>,
  steps: string[],
): {
  ES: Map<string, number>;
  EF: Map<string, number>;
  projectDuration: number;
} {
  const ES = new Map<string, number>();
  const EF = new Map<string, number>();

  for (const id of topologicalOrder) {
    const task = taskMap.get(id)!;
    let es = 0;
    for (const dep of task.dependencies) {
      es = Math.max(es, EF.get(dep) ?? 0);
    }
    const ef = es + task.duration;
    ES.set(id, es);
    EF.set(id, ef);
    steps.push(`[Forward] "${id}" (${task.name}): ES=${es}, EF=${ef}`);
  }

  const projectDuration = Math.max(
    0,
    ...topologicalOrder.map((id) => EF.get(id) ?? 0),
  );

  steps.push(`[Forward] Project duration = ${projectDuration} days.`);
  return { ES, EF, projectDuration };
}

function backwardPass(
  tasks: Task[],
  topologicalOrder: string[],
  taskMap: Map<string, Task>,
  adjList: Map<string, string[]>,
  projectDuration: number,
  steps: string[],
): { LS: Map<string, number>; LF: Map<string, number> } {
  const LS = new Map<string, number>();
  const LF = new Map<string, number>();

  const hasSuccessor = new Set<string>();
  for (const task of tasks) {
    for (const dep of task.dependencies) {
      hasSuccessor.add(dep);
    }
  }

  for (const id of [...topologicalOrder].reverse()) {
    const task = taskMap.get(id)!;

    let lf: number;
    if (!hasSuccessor.has(id)) {
      lf = projectDuration;
    } else {
      lf = Infinity;
      for (const succ of adjList.get(id) ?? []) {
        lf = Math.min(lf, LS.get(succ) ?? Infinity);
      }
    }

    const ls = lf - task.duration;
    LF.set(id, lf);
    LS.set(id, ls);

    steps.push(`[Backward] "${id}" (${task.name}): LF=${lf}, LS=${ls}`);
  }

  return { LS, LF };
}

export function computeCpm(tasks: Task[]): CpmResult | CpmError {
  const steps: string[] = [];

  const validationError = validateTasks(tasks);
  if (validationError) return validationError;

  steps.push(
    `[Init] ${tasks.length} tasks, ${tasks.reduce((sum, t) => sum + t.dependencies.length, 0)} dependencies.`,
  );

  const { adjList, inDegree } = buildGraph(tasks);
  steps.push('[Graph] Adjacency list and in-degree map built.');

  const taskMap = new Map<string, Task>(tasks.map((t) => [t.id, t]));

  const { order: topologicalOrder, hasCycle } = kahnTopologicalSort(
    tasks,
    adjList,
    inDegree,
    steps,
  );

  if (hasCycle) {
    return {
      message:
        'A cycle was detected in the task dependencies. CPM requires a Directed Acyclic Graph (DAG). Please remove the circular dependency.',
      cycleDetected: true,
    };
  }

  const { ES, EF, projectDuration } = forwardPass(
    tasks,
    topologicalOrder,
    taskMap,
    steps,
  );

  const { LS, LF } = backwardPass(
    tasks,
    topologicalOrder,
    taskMap,
    adjList,
    projectDuration,
    steps,
  );

  const scheduledTasks: ScheduledTask[] = tasks.map((task) => {
    const es = ES.get(task.id) ?? 0;
    const ef = EF.get(task.id) ?? 0;
    const ls = LS.get(task.id) ?? 0;
    const lf = LF.get(task.id) ?? 0;
    const float = ls - es;
    return {
      ...task,
      earliestStart: es,
      earliestFinish: ef,
      latestStart: ls,
      latestFinish: lf,
      float,
      isCritical: float === 0,
    };
  });

  const criticalPath = topologicalOrder.filter(
    (id) => scheduledTasks.find((t) => t.id === id)?.isCritical,
  );

  steps.push(`[Float] Critical tasks (float = 0): ${criticalPath.join(', ')}`);
  steps.push(
    `[Result] Critical path: ${criticalPath.join(' → ')} | Project duration: ${projectDuration} days.`,
  );

  return {
    scheduledTasks,
    topologicalOrder,
    criticalPath,
    projectDuration,
    steps,
  };
}

export function isCpmError(result: CpmResult | CpmError): result is CpmError {
  return 'message' in result;
}
