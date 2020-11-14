import { ITask } from "../mapFile";
import { BaseTask } from "./base_task";
import { BasicTask } from "./basicTask";

export module taskManifest {
    export function loadTasks(tasks: ITask[]): Record<string, BaseTask> {
        let outTasks: Record<string, BaseTask> = {};
        tasks.forEach((task: ITask) => {
            outTasks[task.id] = loadTask(task);
        })

        return outTasks;
    }

    function loadTask(task: ITask): BaseTask {
        if (task.classID == 'basic') { return new BasicTask(task.id, task.requireConfirmationScan, task.params) };
        throw new Error(`${task.classID} is not a task type!`);
    }
}