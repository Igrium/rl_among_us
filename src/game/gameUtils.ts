import { IMapFile } from "./mapFile";
import { join } from "path";
import { readFileSync } from "fs";

/**
 * An assortment of utility functions for the game server.
 */
export module gameUtils {
    export function chooseImposters(names: string[], numOfImposters?: number): string[] {
        if (!numOfImposters) {
            numOfImposters = Math.ceil(names.length / 5);
        }
        let imposters: string[] = []
        for (let i = 0; i < numOfImposters; i++) {
            let index = Math.floor(Math.random() * names.length);
            imposters.push(names[index]);
            names.splice(index, 1);
        }

        return imposters;
    }
    
    /**
     * Load a map.
     * @param name The name of the map to load.
     */
    export function loadMapFile(name: string): IMapFile {
        let fullname = join('maps', `${name}.json`);
        let rawdata = readFileSync(fullname).toString();

        let json = JSON.parse(rawdata);

        return <IMapFile> json;
    }
}