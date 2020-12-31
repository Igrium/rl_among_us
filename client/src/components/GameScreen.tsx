import React, { Component } from 'react'
import Gameplay from './gameplay/Gameplay'
import { GameManager } from '../logic/GameManager'

interface IProps {
    gameManager: GameManager;
};
interface IState {
    gameState: GameState;
};

export enum GameState {
    GAMEPLAY,
    MEETING
}

class GameScreen extends Component<IProps, IState> {

    constructor(props: IProps) {
        super(props)
    
        this.state = {
            gameState: GameState.GAMEPLAY
        }
    }

    render() {
        if (this.state.gameState == GameState.GAMEPLAY) {
            return <Gameplay gameManager={this.props.gameManager}/>
        }
    }
}

export default GameScreen
