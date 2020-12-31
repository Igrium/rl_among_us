/**
 * Client-side representation of a player.
 */
interface ILightPlayer {
    name: string,
    color: string,
    isImposter: boolean,
    isAlive: boolean
}

export default ILightPlayer;