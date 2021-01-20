import { Player } from "../player";
import { BaseTask, TaskInstanceObject } from "./baseTask";

interface IPlayerState {
    pattern: number[]
    stage: number
}

export class SimonSays extends BaseTask {
    entries: Record<string, IPlayerState> = {};

    getClassID(): string {
        return 'simonSays'
    }

    doTask(player: Player, instance: TaskInstanceObject): void {

        let entry = this.entries[player.name]
        if (entry === undefined) {
            entry = {
                pattern: this.generatePattern(),
                stage: 0
            }
            this.entries[player.name] = entry;
        }

        player.client.emit('task.simonSays.setState', entry);
        
        instance.socketOn('task.simonSays.updateStage', (stage: number) => {
            this.entries[player.name].stage = stage;
        })

    }



    generatePattern() {
        let pattern: number[] = [];
        while (pattern.length <= 5) {
            // Random number between 0 and 8
            pattern.push(Math.floor(Math.random() * 9))
        }
        return pattern;
    }
}
