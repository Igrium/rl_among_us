import React, { Component } from 'react'
import { renderIntoDocument } from 'react-dom/test-utils'
import ILightPlayer from '../../../../../common/ILightPlayer'

interface IProps {
    allowVoting: boolean
    roster: ILightPlayer[]
    renderImposters: boolean
    onVote: (target: string) => void
}

export class VotingScreen extends Component<IProps> {
    constructor(props: IProps) {
        super(props)

        this.handleSkip.bind(this);
    }
    

    player(player: ILightPlayer) {
        const { allowVoting } = this.props;
        let isRed = (this.props.renderImposters && player.isImposter);
        let color;

        if (isRed) {
            color = player.isAlive && allowVoting ? '#7F0400' : '#804240'
        } else {
            color = player.isAlive && allowVoting ? '#000' : '#333'
        }

        const handleVote = () => {
            if (this.props.allowVoting) {
                this.props.onVote(player.name);
            }
        }

        return <button style={{ color: color }} onClick={handleVote}>{player.name}</button>
    }

    handleSkip = () => {
        this.props.onVote('SKIP');
    }

    render() {
        return (
            <div>
                <h1>Who is the Imposter?</h1>
                <ul>
                    {this.props.roster.map(player => {
                        return <li key={player.name}>{this.player(player)}</li>
                    })}
                </ul>
                {this.props.allowVoting ? <button onClick={this.handleSkip}>Skip Vote</button> : null}
            </div>
        )
    }
}

export default VotingScreen
