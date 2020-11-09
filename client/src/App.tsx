import React, { useEffect, Component } from 'react';
import logo from './logo.svg';
import socketIOClient from 'socket.io-client';
import './App.css';
import ClientTestComponent from './ClientTestComponent';



function App() {

  useEffect(() => {
    const socket = socketIOClient.io('http://localhost:5000', {transports: ['websocket']});
    socket.on('disconnectWarning', (message: any, data: any) => {
      console.log('test');
    })
  })

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <ClientTestComponent />
    </div>

  );
}

export default App;
