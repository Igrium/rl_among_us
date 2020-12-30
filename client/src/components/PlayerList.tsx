import React, { Component } from 'react'
import ConnectionHandler from '../logic/ConnectionHandler';

interface IProps {};
interface IState {
    playerList: string[]
}

export class PlayerList extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
    
        this.state = {
            playerList: []
        }
    }

    componentDidMount() {
        ConnectionHandler.activeConnection.io.on('updateRoster', this.handleUpdateRoster);
    }

    handleUpdateRoster = (roster: string[]) => {
        this.setState({ playerList: roster });
    }
    

    render() {
        const { playerList } = this.state;
        const listItems = playerList.map((player) => <li key={player}>{player}</li>);
        return (
            <div>
                <ul>
                    {listItems}
                </ul>
            </div>
        )
    }
}

export default PlayerList

