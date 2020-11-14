export interface IMapFile {
    /** Path to image resource to be displayed as the map. */
    mapImage: string; 

    /** All the tasks in the map. */
    tasks: ITask[]
}

export interface ITask {
    id: string,
    classID: string,
    coords: [number, number],
    icon: string,
    requireConfirmationScan: boolean,
    params: any
}