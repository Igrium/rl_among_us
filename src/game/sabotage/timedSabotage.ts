import e from "express";
import { ISabotage } from "../../../common/IMapFile";
import { gameServer } from "../../gameServer";
import { EmergencyButtonInterface } from "../gameField/emergencyButton";
import { BaseSabotage } from "./baseSabotage";

const DEFAULT_TIME = 20;

/**
 * A sabotage which ends the game after a certian amount of time, like Oxygen.
 */
class TimedSabotage extends BaseSabotage {

    public readonly timeout: number;

    constructor(definition: ISabotage) {
        super(definition)

        if (definition.timeout != undefined) {
            this.timeout = definition.timeout;
        } else {
            this.timeout = DEFAULT_TIME;
        }
    }
    
    isCritical(): boolean {
        return true;
    }
    

    getLightSabotage() {
        let parent = super.getLightSabotage();
        parent.timeout = this.timeout;
        return parent;
    }

    beginSabotage() {
        super.beginSabotage();
        let timer = setTimeout(() => {
            this.end();
        }, this.timeout * 1000);

        this.onEnd(() => {
            clearTimeout(timer);
        })

        // Temporary. Delete once sabotages fixes are implemented.
        if ('emergencyButton' in gameServer.fieldComputers) {
            let emergencyButton = gameServer.fieldComputers.emergencyButton as EmergencyButtonInterface;
            emergencyButton.onButtonPressed(() => {
                this.endSabotage();
            })
        }
    }

    end() {
        console.log("If the round system was implemented, the imposter would have won.")
        this.endSabotage();
    }
    
}

export default TimedSabotage