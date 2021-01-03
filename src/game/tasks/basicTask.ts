import { BaseTask } from "./baseTask";
import { Player } from "../player";

export class BasicTask extends BaseTask {
    getClassID(): string {
        return 'basic';
    }
    doTask(player: Player): void {
    }
    
}