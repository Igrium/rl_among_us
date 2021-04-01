import { ISabotage } from "../../../common/IMapFile";
import { BaseSabotage } from "./baseSabotage";
import { BasicSabotage } from "./basicSabotage";

export module sabotageManifest {
    export function loadSabotages(sabotages: ISabotage[]): Record<string, BaseSabotage> {
        let outSabotages: Record<string, BaseSabotage> = {};
        sabotages.forEach((task: ISabotage) => {
            outSabotages[task.id] = loadSabotage(task);
        })

        return outSabotages;
    }

    function loadSabotage(sabotage: ISabotage): BaseSabotage {
        // REGISTER TASKS HERE
        if (sabotage.classID === 'basic') {return new BasicSabotage(sabotage.id)}

        throw new Error(`${sabotage.classID} is not a sabotage type!`);
    }
}