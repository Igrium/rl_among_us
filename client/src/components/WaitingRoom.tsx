import React, { Component } from 'react';
import { CirclePicker } from 'react-color';
import ConnectionHandler from '../logic/ConnectionHandler';

interface IProps {};
interface IState {
    playerList: ILightPlayer[]
    color: string
}

interface ILightPlayer {
    name: string,
    color: string
}

export class PlayerList extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
    
        this.state = {
            playerList: [],
            color: '#000'
        }
    }

    componentDidMount() {
        ConnectionHandler.activeConnection.io.on('updateRoster', this.handleUpdateRoster);
    }

    handleUpdateRoster = (roster: ILightPlayer[]) => {
        this.setState({ playerList: roster });
    }
    
    handleColorChange = (color: any) => {
        this.setState({ color: color.hex });
        ConnectionHandler.activeConnection.io.emit('setColor', color.hex);
        console.log(`Set local color to ${color.hex}`);
    }

    handleStartGame = (event: React.MouseEvent) => {
        event.preventDefault();
        ConnectionHandler.activeConnection.io.emit('startGame');
    }

    render() {
        const { playerList } = this.state;
        const listItems = playerList.map(
            (player) => <li key={player.name} style={{ color: player.color }}>{player.name}</li>
        );
        return (
            <div>
                <ul>
                    {listItems}
                </ul>
                <CirclePicker onChange={this.handleColorChange}/>
                <button onClick={this.handleStartGame}>Start Game</button>
            </div>
        )
    }
}

export default PlayerList

