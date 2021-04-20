export interface IMapFile {
    /** Path to image resource to be displayed as the map. */
    mapImage: string; 

    /** All the tasks in the map. */
    tasks: ITask[]
    
    sabotages: ISabotage[]
}

export interface ITask {
    id: string,
    classID: string,
    coords: [number, number],
    icon: string,
    requireConfirmationScan: boolean,
    params: any
}

/**
 * Represents a map sabotage. Note: this is the sabotage itself, not the "fixing stations."
 */
export interface ISabotage {
    id: string,
    classID: string,
    prettyName?: string
}