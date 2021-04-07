import { ISabotage } from "../../../../common/IMapFile";
import { Sabotage } from "./Sabotage";

export module sabotageManifest {
    export function loadSabotages(sabotages: ISabotage[]): Record<string, Sabotage> {
        let outSabotages: Record<string, Sabotage> = {};
        sabotages.forEach((sabotage: ISabotage) => {
            outSabotages[sabotage.id] = loadSabotage(sabotage);
        })

        return outSabotages;
    }

    function loadSabotage(sabotage: ISabotage): Sabotage {
        // REGISTER SABOTAGES HERE

        throw new Error(`${sabotage.classID} is not a sabotage type!`);
    }
}