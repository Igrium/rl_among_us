import React, { Component } from 'react'

interface IProps {
    onScan: (value?: string) => void
    displayText?: string
}

interface IState {
    textValue: string
}

export class QRCodeScanner extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    
        this.state = {
            textValue: ''
        }
    }

    handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ textValue: event.target.value });
    }

    handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        this.props.onScan(this.state.textValue);
    }

    handleClose = () => {
        this.props.onScan('');
    }

    render() {
        return (
            <div>
                <button className='CloseButton' onClick={this.handleClose}>X</button>
                <form onSubmit={this.handleSubmit}>
                    <h2>{this.props.displayText}</h2>
                    <label>Enter QR Code Text</label>
                    <br />
                    <input type='text' value={this.state.textValue} onChange={this.handleTextChange}></input>
                    <br />
                    <button type='submit'>Submit</button>
                </form>
            </div>
        )
    }
}

export default QRCodeScanner
