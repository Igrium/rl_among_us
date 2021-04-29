import { ISabotage } from "../../../common/IMapFile";
import { BaseSabotage } from "./baseSabotage";
import { BasicSabotage } from "./basicSabotage";
import TimedSabotage from "./timedSabotage";

export module sabotageManifest {
    export function loadSabotages(sabotages: ISabotage[]): Record<string, BaseSabotage> {
        let outSabotages: Record<string, BaseSabotage> = {};
        sabotages.forEach((task: ISabotage) => {
            outSabotages[task.id] = loadSabotage(task);
        })

        return outSabotages;
    }

    function loadSabotage(sabotage: ISabotage): BaseSabotage {
        // REGISTER SABOTAGES HERE
        if (sabotage.classID === 'basic') {return new BasicSabotage(sabotage)}
        if (sabotage.classID === 'timedSabotage') {return new TimedSabotage(sabotage)}

        throw new Error(`${sabotage.classID} is not a sabotage type!`);
    }
}