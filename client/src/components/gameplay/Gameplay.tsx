import React, { Component } from 'react'
import { GameManager } from '../../logic/GameManager'
import PlayerList from '../testing/PlayerList'

interface IProps {
    gameManager: GameManager
}

interface IState {}

export class Gameplay extends Component<IProps, IState> {
    render() {
        return (
            <div>
                <h1>Gameplay Screen</h1>
                <PlayerList players={this.props.gameManager.players} />
            </div>
        )
    }
}

export default Gameplay
