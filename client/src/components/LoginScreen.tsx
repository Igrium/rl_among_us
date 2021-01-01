import React, { Component } from 'react'

interface IProps {
    onSubmit: (connectionInfo: IConnectionInfo) => void
}

export interface IConnectionInfo {
    url: string,
    playerName: string
}


class LoginScreen extends Component<IProps, IConnectionInfo> {


    constructor(props: IProps) {
        super(props)
    
        this.state = {
            url: 'http://localhost:5000',
            playerName: ''
        }
        
    }
    
    private handlePlayerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ playerName: event.target.value });
    }
    
    private handleURLChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ url: event.target.value });
    }

    private handleSubmit = (event: React.SyntheticEvent) => {
        this.props.onSubmit({ url: this.state.url, playerName: this.state.playerName });
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    URL
                    <input type='text' value={this.state.url} onChange={this.handleURLChange} />
                </label>
                <br />
                <label>
                    Player Name:
                    <input type='text' value={this.state.playerName} onChange={this.handlePlayerChange}></input>
                </label>
                <br />
                <button type='submit'>Submit</button>
            </form>
        )
    }
}

export default LoginScreen
