import { ISabotageFix } from "./IMapFile";

/**
 * A basic representation of a sabotage used by the client.
 */
interface ILightSabotage {
    id: string;

    /** The locations where this sabotage can be fixed. */
    fixLocations: ISabotageFix[];

    /** Whether to trigger the alarm */
    isCritical: boolean;

    timeout?: number;
}

export default ILightSabotage