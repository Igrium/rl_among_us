import React, { useEffect, Component } from 'react';
import './App.css';
import LoginScreen from './components/LoginScreen';
import ConnectionHandler, {IConnectionInfo} from './logic/ConnectionHandler'



function App() {

    function handleSubmit(connectionInfo: any) {
        ConnectionHandler.activeConnection = new ConnectionHandler({
            url: connectionInfo.url,
            playerName: connectionInfo.playerName
        }, () => {
            alert(`Connected to ${connectionInfo.url} as ${connectionInfo.playerName}`);
        })
    }

    return (
        <div className="App">
            <LoginScreen onSubmit={handleSubmit} />
        </div>

    );
}

export default App;
