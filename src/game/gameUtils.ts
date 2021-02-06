import { IMapFile, ITask } from "../../common/IMapFile"
import { join } from "path";
import { readFileSync } from "fs";
import { gameServer } from "../gameServer";
import { Player } from "./player";
import ILightPlayer from "../../common/ILightPlayer";

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
     * Assign a player their tasks.
     * 
     * Will assign `numTasks` or `tasks.length` number of tasks, whichever is smaller.
     * @param tasks All the tasks in the map.
     * @param numTasks The number of tasks to assign each player.
     */
    export function assignTasks(tasks: ITask[], numTasks: number) {
        let i = 0;
        let availableTasks = [...tasks];
        let assignedTasks: string[] = [];

        while (availableTasks.length > 0 && i < numTasks) {
            let index = Math.floor(Math.random() * availableTasks.length)
            assignedTasks.push(availableTasks[index].id);
            availableTasks.splice(index, 1);
        }

        return assignedTasks;
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

    /**
     * Emit an event to all registered player clients.
     */
    export function announce(event: string | symbol, ...args: any[]) {
        Object.values(gameServer.players).forEach(player => {
            player.client.emit(event, ...args);
        })
    }

    export function generateLightPlayer(player: Player): ILightPlayer {
        return {
            name: player.name,
            color: player.color,
            isImposter: player.isImposter,
            isAlive: player.isAlive
        };
    }

    export function generateLightRoster(players: Record<string, Player>): Record<string, ILightPlayer> {
        let roster: Record<string, ILightPlayer> = {};
        for (let key in players) {
            let player = players[key];
            roster[player.name] = generateLightPlayer(player);    
        }

        return roster;
    }
    
}