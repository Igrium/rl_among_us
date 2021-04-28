/**
 * A basic representation of a sabotage used by the client.
 */
interface ILightSabotage {
    id: string;

    /** The locations where this sabotage can be fixed. */
    fixLocations: [number, number][];

    /** Whether to trigger the alarm */
    isCritical: boolean;
}

export default ILightSabotage