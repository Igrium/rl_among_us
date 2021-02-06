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

const EJECT_ANIM_DURATION = 5000;

export class Meeting {
    state: MeetingState = MeetingState.WAITING
    presentPlayers: Record<string, boolean> = {};
    playerVotes: Record<string, string> = {};
    
    readonly discussionTime: number = gameServer.gameConfig.discussionTime * 1000
    readonly votingTime: number = gameServer.gameConfig.votingTime * 1000

    emitter = new EventEmitter();

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
        console.log(`${playerName} has arrived at the meeting.`)

        // See if we should start the meeting
        if (this.state === MeetingState.WAITING) {
            console.log(this.presentPlayers);
            for (let player in gameServer.players) {
                if (!this.presentPlayers[player]) {
                    return;
                }
            }
            this.startDiscussion();
        }
    }

    startDiscussion() {
        console.log("Starting discussion...")
        gameUtils.announce('startDiscussion', Date.now() + this.discussionTime);
        this.state = MeetingState.DISCUSSION;
        setTimeout(() => this.startVote(), this.discussionTime);
        this.emitter.emit('startDiscussion', Date.now() + this.discussionTime);
    }

    startVote() {
        console.log("Starting vote...")
        gameUtils.announce('startVote', Date.now() + this.votingTime);
        this.state = MeetingState.VOTING

        const timeout = setTimeout(() => this.endVote(), this.votingTime);

        Object.values(gameServer.players).forEach(player => {
            // When server recieves vote
            player.client.once('vote', (target: string) => {
                if (this.state !== MeetingState.VOTING) return;
                console.log(`${player.name} voted for ${target}.`)
                this.playerVotes[player.name] = target;
                {
                    // See if everyone has voted
                    for (let playerName in this.presentPlayers) {
                        if (this.presentPlayers[playerName] && !(playerName in this.playerVotes)) {
                            return;
                        }
                    }
                    clearTimeout(timeout);
                    this.endVote();
                }
            })
        })

        this.emitter.emit('startVote', Date.now() + this.votingTime);
    }

    endVote() {
        this.state = MeetingState.END_VOTE;
        let result = countVotes(Object.values(this.playerVotes));
        let data = {result: result, playerVotes: this.playerVotes};
        console.log(`Vote is complete! Result: ${result}`);
        gameUtils.announce('endVote', data);

        if (!(result === 'SKIP' || result === 'TIE')) {
            gameServer.killPlayer(result, true);
        }

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

    for (let target in count) {
        if (count[target] > max) {
            topVotes = [target];
            max = count[target];
        } else if (count[target] === max) {
            topVotes.push(target);
        }
    }

    if (topVotes.length > 1) return 'TIE';
    return topVotes[0];
}
