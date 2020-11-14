import { BaseTask } from "./base_task";
import { Player } from "../player";

export class BasicTask extends BaseTask {
    getClassID(): string {
        return 'basic';
    }
    doTask(player: Player): void {
    }
    
}