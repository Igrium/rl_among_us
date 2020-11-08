import { IConnectionInfo } from './connectionInfo';

export interface IPlayerConnectionInfo extends IConnectionInfo {
    /**The username of the player */
    name: string;
}