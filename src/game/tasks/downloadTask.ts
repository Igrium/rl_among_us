import { Player } from "../player";
import { BaseTask } from "./baseTask";

export class DownloadTask extends BaseTask {
    
    getClassID(): string {
        return 'download';
    }
    doTask(player: Player): void {}
    
}