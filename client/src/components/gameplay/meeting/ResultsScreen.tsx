import { stringify } from 'querystring';
import React, { Component } from 'react'
import { renderIntoDocument } from 'react-dom/test-utils'
import ILightPlayer from '../../../../../common/ILightPlayer'

interface IProps {
    roster: ILightPlayer[]
    renderImposters: boolean,
    playerVotes: Record<string, string>,
    result: string
}

export class ResultsScreen extends Component<IProps> {
    constructor(props: IProps) {
        super(props)
    }
    

    player(player: ILightPlayer, voters: string[]) {
        let isRed = (this.props.renderImposters && player.isImposter);
        let color = '#000';

        if (isRed) {
            color = player.isAlive ? '#7F0400' : '#804240'
        } else {
            color = player.isAlive ? '#000' : '#333'
        }

        return (
            <p style={{color: color}}>
                {player.name}
                {voters ? voters.map(voterColor => (
                    <span className="dot" style={{backgroundColor: voterColor}}></span>
                )): null}
            </p>
        ) 
    }

    generateVoterList() {
        const { roster, playerVotes } = this.props;
        const sortedRoster: Record<string, ILightPlayer> = {};

        // Key: target, Value: players who voted for the,
        const votes: Record<string, string[]> = {};

        // This way we're not searching through the roster for player color over and over.
        roster.forEach(player => {
            sortedRoster[player.name] = player;
        })

        for (let playerName in playerVotes) {
            let target = playerVotes[playerName];

            if (target in votes) {
                votes[target].push(sortedRoster[playerName].color);
            } else {
                votes[target] = [sortedRoster[playerName].color];
            }
        }
        console.log(votes);
        return votes;
    }
    
    render() {
        let voterList = this.generateVoterList();
        return (
            <div>
                <h1>Voting Results</h1>
                <ul>
                    {this.props.roster.map(player => {
                        <li key={player.name}>{this.player(player, voterList[player.name])}</li>
                    })}
                </ul>
                <h2>Outcome: {this.props.result}</h2>
            </div>
        )
    }
}

export default ResultsScreen
