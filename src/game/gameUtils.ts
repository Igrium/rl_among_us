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
}