import React, { Component } from 'react'
import { GameManager } from '../../../logic/GameManager'
import ResultsScreen from './ResultsScreen';
import VotingScreen from './VotingScreen';

enum MeetingState {
    WAITING,
    PRESENT,
    DISCUSSION,
    VOTING,
    VOTED,
    END_VOTE
}

interface IProps {
    gameManager: GameManager
}

interface IState {
    meetingState: MeetingState,
    results: {result: string, playerVotes: Record<string, string>}
}

export class Meeting extends Component<IProps, IState> {

    constructor(props: IProps) {
        super(props)
    
        this.state = {
            meetingState: MeetingState.WAITING,
            results: {result: 'TIE', playerVotes: {}}
        }

    }

    get meetingManager() { return this.props.gameManager.meetingManager }

    componentDidMount() {
        this.meetingManager.onStartDiscussion((endTime: number) => {
            console.log(`Discussion started. End time: ${endTime}`)
            this.setState({ meetingState: MeetingState.DISCUSSION });
        })

        this.meetingManager.onStartVote(() => {
            this.setState({ meetingState: MeetingState.VOTING });
        })

        this.meetingManager.onEndVote((data) => {
            console.log(`Vote is complete! Result: ${data.result}`)
            this.setState( {meetingState: MeetingState.END_VOTE, results: data} )
        });
    }
    
    attendanceScreen() {
        return (
            <div>
                <h1>Meeting Called!</h1>
                <p>Please make your way to the meeting point.</p>
                <button onClick={this.handleArrive}>I'm here.</button>
            </div>
        )
    }

    waitingScreen() {
        return (
            <div>
                <h2>Waiting for other players...</h2>
            </div>
        )
    }

    handleArrive = () => {
        this.meetingManager.markPresent();
        this.setState({ meetingState: MeetingState.PRESENT });
    }

    handleVote = (target: string) => {
        this.meetingManager.vote(target);
        this.setState({ meetingState: MeetingState.VOTED })
    }

    render() {
        const { meetingState, results } = this.state;
        const { gameManager } = this.props;
        const renderImposters = gameManager.localPlayer.isImposter;
        if (meetingState === MeetingState.WAITING) {
            return this.attendanceScreen();
        }
        if (meetingState === MeetingState.PRESENT) {
            return this.waitingScreen();
        }
        if (meetingState === MeetingState.END_VOTE) {
            return <ResultsScreen roster={gameManager.players} renderImposters={renderImposters} result={results.result} playerVotes={results.playerVotes}/>
        }
        return (
            <VotingScreen allowVoting={meetingState === MeetingState.VOTING} roster={gameManager.players} renderImposters={renderImposters} onVote={this.handleVote} />
        )
    }
}

export default Meeting
