import React, { useEffect, Component } from 'react';
import './App.css';
import './css/Game.css';
import LoginScreen from './components/LoginScreen';
import ConnectionHandler, {IConnectionInfo} from './logic/ConnectionHandler'
import WaitingRoom from './components/WaitingRoom';
import GameScreen from './components/GameScreen';
import { GameManager } from './logic/GameManager';

interface IProps {}
interface IState {
    isConnected: boolean
    isInGame: boolean
}

class App extends Component<IProps, IState> {

    gameManager?: GameManager;

    constructor(props: IProps) {
        super(props)
        this.state = {
            isConnected: false,
            isInGame: false
        }
    }
    
    protected initializeListeners() {
        if (this.gameManager == undefined) return;
        this.gameManager.onGameStart(() => {
            this.setState({ isInGame: true });
        })
    }

    handleSubmit = (connectionInfo: any) => {
        ConnectionHandler.activeConnection = new ConnectionHandler({
            url: connectionInfo.url,
            playerName: connectionInfo.playerName
        }, () => {
            console.log(`Connected to ${connectionInfo.url} as ${connectionInfo.playerName}`);
            const activeConnection = ConnectionHandler.activeConnection;
            this.gameManager = new GameManager(activeConnection);
            this.initializeListeners();

            this.setState({ isConnected: true });
            activeConnection.io.on('disconnect', () => {
                this.setState({ isConnected: false, isInGame: false });
            })
        })
    }

    handleEndGame = () => {
        this.setState({ isInGame: false });
    }

    render() {
        if (!this.state.isConnected) {
            // Log in screen
            return (
                <div className="App">
                    <LoginScreen onSubmit={this.handleSubmit} />
                </div>
            )
        } else if (!this.state.isInGame) {
            // Lobby screen
            return (
                <div className="app">
                    <WaitingRoom />
                </div>
            )
        } else {
            // Game screen
            if (this.gameManager === undefined) {
                alert("App is connected without a game manager. This should not be able to happen.")
                return <div className="app"></div>;
            }
            else return (
                <div className="app">
                <GameScreen gameManager={this.gameManager} onGameFinished={this.handleEndGame}/>
                </div>
            )
        }
    }
}

export default App;
