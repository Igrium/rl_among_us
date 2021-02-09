import React, { Component } from 'react'
import { renderIntoDocument } from 'react-dom/test-utils'
import ILightPlayer from '../../../../../common/ILightPlayer'
import Timer from '../../util/Timer';

interface IProps {
    allowVoting: boolean
    roster: ILightPlayer[]
    renderImposters: boolean,
    endTime?: number,
    onVote: (target: string) => void
}

export class VotingScreen extends Component<IProps> {
    constructor(props: IProps) {
        super(props)

        this.handleSkip.bind(this);
    }
    

    player(player: ILightPlayer) {
        let { allowVoting } = this.props;
        let isRed = (this.props.renderImposters && player.isImposter);
        let color;

        if (!player.isAlive) allowVoting = false;

        if (isRed) {
            color = player.isAlive ? 'imposter-alive' : 'imposter-dead'
        } else {
            color = player.isAlive ? 'crewmate-alive' : 'crewmate-dead'
        }

        const handleVote = () => {
            if (this.props.allowVoting) {
                this.props.onVote(player.name);
            }
        }

        console.log(color);

        if (allowVoting) return <button className={`votingPlayer ${color}`} onClick={handleVote}>{player.name}</button>
        else return <span className={color}>{player.name}</span>
    }

    handleSkip = () => {
        this.props.onVote('SKIP');
    }

    render() {
        const { roster, allowVoting, endTime } = this.props;
        return (
            <div>
                <h1>Who is the Imposter?</h1>
                <ul>
                    {roster.map(player => {
                        return <li key={player.name}>{this.player(player)}</li>
                    })}
                </ul>
                {allowVoting ? <button onClick={this.handleSkip}>Skip Vote</button> : null}
                {endTime ? <Timer endTime={endTime} className={'countdown-timer'}/> : null}
            </div>
        )
    }
}

export default VotingScreen
