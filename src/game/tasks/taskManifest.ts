import { ITask } from "../../../common/IMapFile";
import { BaseTask } from "./baseTask";
import { BasicTask } from "./basicTask";
import { DownloadTask } from "./downloadTask";

export module taskManifest {
    export function loadTasks(tasks: ITask[]): Record<string, BaseTask> {
        let outTasks: Record<string, BaseTask> = {};
        tasks.forEach((task: ITask) => {
            outTasks[task.id] = loadTask(task);
        })

        return outTasks;
    }

    function loadTask(task: ITask): BaseTask {
        // REGISTER TASKS HERE
        if (task.classID == 'basic') { return new BasicTask(task.id, task.requireConfirmationScan, task.params) };
        if (task.classID == 'download') { return new DownloadTask(task.id, task.requireConfirmationScan, task.params )};
        throw new Error(`${task.classID} is not a task type!`);
    }
}