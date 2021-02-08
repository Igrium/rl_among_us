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
    

    player(player: ILightPlayer, voters: ILightPlayer[]) {
        let isRed = (this.props.renderImposters && player.isImposter);
        let color = '#000';
        console.log(`${player.name}: ${JSON.stringify(voters)}`)
        if (isRed) {
            color = player.isAlive ? 'imposter-alive' : 'imposter-dead'
        } else {
            color = player.isAlive ? 'crewmate-alive' : 'crewmate_dead'
        }

        return (
            <span className={color}>
                {player.name}
                {voters ? voters.map(voter => (
                    <span className="dot" key={voter.name} style={{backgroundColor: voter.color}}></span>
                )): null}
            </span>
        ) 
    }

    // Generate a list of players and the people who voted for them.
    generateVoterList() {
        const { roster, playerVotes } = this.props;
        const sortedRoster: Record<string, ILightPlayer> = {};

        // Key: target, Value: players who voted for the,
        const votes: Record<string, ILightPlayer[]> = {};

        // This way we're not searching through the roster for player color over and over.
        roster.forEach(player => {
            sortedRoster[player.name] = player;
        })

        for (let playerName in playerVotes) {
            let target = playerVotes[playerName];

            if (target in votes) {
                votes[target].push(sortedRoster[playerName]);
            } else {
                votes[target] = [sortedRoster[playerName]];
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
                        return <li key={player.name}>{this.player(player, voterList[player.name])}</li>
                    })}
                </ul>
                <h2>Outcome: {this.props.result}</h2>
            </div>
        )
    }
}

export default ResultsScreen
