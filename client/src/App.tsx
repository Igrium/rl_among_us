import React, { useEffect, Component } from 'react';
import './App.css';
import LoginScreen from './components/LoginScreen';
import ConnectionHandler, {IConnectionInfo} from './logic/ConnectionHandler'
import PlayerList from './components/PlayerList';

interface IProps {}
interface IState {
    isConnected: boolean
    isInGame: boolean
}

class App extends Component<IProps, IState> {

    constructor(props: IProps) {
        super(props)
    
        this.state = {
            isConnected: false,
            isInGame: false
        }
    }
    


    handleSubmit = (connectionInfo: any) => {
        ConnectionHandler.activeConnection = new ConnectionHandler({
            url: connectionInfo.url,
            playerName: connectionInfo.playerName
        }, () => {
            console.log(`Connected to ${connectionInfo.url} as ${connectionInfo.playerName}`);
            const activeConnection = ConnectionHandler.activeConnection;
            this.setState({ isConnected: true });
            activeConnection.io.on('disconnect', () => {
                this.setState({ isConnected: false, isInGame: false });
            })
        })
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
                    <PlayerList />
                </div>
            )
        } else {
            // Game screen
            <div className="app">

            </div>
        }
    }
}

export default App;
