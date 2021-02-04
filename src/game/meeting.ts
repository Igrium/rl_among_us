import { EventEmitter } from "events";
import { emit } from "process";
import { gameServer } from "../gameServer"
import { gameUtils } from "./gameUtils";

enum MeetingState {
    WAITING,
    DISCUSSION,
    VOTING,
    END_VOTE
}

const EJECT_ANIM_DURATION = 2000;

export class Meeting {
    state: MeetingState = MeetingState.WAITING
    presentPlayers: Record<string, boolean> = {};
    playerVotes: Record<string, string> = {};
    
    readonly discussionTime: number = gameServer.gameConfig.discussionTime * 1000
    readonly votingTime: number = gameServer.gameConfig.votingTime * 1000

    emitter: EventEmitter;

    constructor() {
        Object.keys(gameServer.players).forEach(playerName => {
            let player = gameServer.players[playerName];
            this.presentPlayers[playerName] = false;

            player.client.once('presentAtMeeting', () => {
                this.handlePlayerArrived(playerName);
            })
        })
    }

    /**
     * Tell all clients to begin the meeting.
     */
    call(emergency: boolean) {
        gameUtils.announce('meetingCalled', emergency);
    }

    handlePlayerArrived(playerName: string) {
        this.presentPlayers[playerName] = true;

        // See if we should start the meeting
        for (let player in Object.keys(gameServer.players)) {
            if (!this.presentPlayers[player]) {
                return;
            }
        }
        this.startDiscussion();
    }

    startDiscussion() {
        gameUtils.announce('startDiscussion', Date.now() + this.discussionTime);
        this.state = MeetingState.DISCUSSION;
        setTimeout(() => this.startVote(), this.discussionTime);
        this.emitter.emit('startDiscussion', Date.now() + this.discussionTime);
    }

    startVote() {
        gameUtils.announce('startVote', Date.now() + this.votingTime);
        this.state = MeetingState.VOTING

        Object.values(gameServer.players).forEach(player => {
            // When server recieves vote
            player.client.once('vote', (target: string) => {
                if (this.state !== MeetingState.VOTING) return;

                this.playerVotes[player.name] = target;
                {
                    // See if everyone has voted
                    for (let playerName in Object.keys(this.presentPlayers)) {
                        if (this.presentPlayers[playerName] && !(playerName in this.playerVotes)) {
                            return;
                        }
                    }
                    this.endVote();
                }
            })
        })

        setTimeout(() => this.endVote(), this.votingTime);
        this.emitter.emit('startVote', Date.now() + this.votingTime);
    }

    endVote() {
        this.state = MeetingState.END_VOTE;
        let result = countVotes(Object.values(this.playerVotes));
        let data = {result: result, playerVotes: this.playerVotes};
        gameUtils.announce('endVote', data);

        setTimeout(() => {
            gameUtils.announce('resumePlay');
            this.emitter.emit('endMeeting');
        }, EJECT_ANIM_DURATION);

        this.emitter.emit('endVote', data);
    }

    onStartDiscussion(listener: (endTime?: number) => void) {
        this.emitter.on('startDiscussion', listener);
    }
    
    onStartVote(listener: (endTime?: number) => void) {
        this.emitter.on('startVote', listener);
    }

    onEndVote(listener: (data?: {result: string, playerVotes: Record<string, string>}) => void) {
        this.emitter.on('endVote', listener);
    }

    onEndMeeting(listener: () => void) {
        this.emitter.on('endMeeting', listener);
    }
}

// This probs isn't optimized but it won't have any more than 10 entries so I don't care.
function countVotes(votes: string[]): string {
    if (votes.length === 0) {
        throw 'Cannot count a vote list with a length of zero.';
    }

    let count: Record<string, number> = {};
    votes.forEach(vote => {
        if (vote in count) count[vote]++;
        else count[vote] = 1;
    })

    let max = 0;
    let topVotes: string[] = []

    Object.keys(count).forEach(target => {
        if (count[target] > max) {
            topVotes = [target];
            max = count[target];
        } else if (count[target] === max) {
            topVotes.push[target];
        }
    })

    if (topVotes.length > 1) return 'TIE';
    return topVotes[0];
}
