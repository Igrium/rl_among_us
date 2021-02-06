import { EventEmitter } from "events";
import ConnectionHandler from "./ConnectionHandler";
import { GameManager } from "./GameManager";

export class MeetingManager {
    private readonly gm: GameManager;
    private readonly cm: ConnectionHandler;

    private readonly em = new EventEmitter();

    constructor(gm: GameManager, cm: ConnectionHandler) {
        this.gm = gm;
        this.cm = cm;

        cm.io.on('meetingCalled', this.meetingCalled);
        cm.io.on('startDiscussion', this.startDiscussion);
        cm.io.on('startVote', this.startVote);
        cm.io.on('endVote', this.endVote);
        cm.io.on('resumePlay', this.resumePlay);
    }

    protected meetingCalled = (emergency: boolean) => {
        this.em.emit('meetingCalled', emergency);
    }

    protected startDiscussion = (endTime: number) => {
        this.em.emit('startDiscussion', endTime);
    }

    protected startVote = (endTime: number) => {
        console.log('Starting vote...');
        this.em.emit('startVote', endTime);
    }

    protected endVote = (data: any) => {
        this.em.emit('endVote', data);
    }

    protected resumePlay = () => {
        this.em.emit('resumePlay');
    }

    reportBody() {
        this.cm.io.emit('reportBody');
    }

    /**
     * Tell the server that the player has arrived at the meeting.
     */
    markPresent() {
        this.cm.io.emit('presentAtMeeting');
    }

    vote(target: string) {
        this.cm.io.emit('vote', target);
    }

    onMeetingCalled(listener: (emergency: boolean) => void) {
        this.em.on('meetingCalled', listener);
    }
    
    onStartDiscussion(listener: (endTime: number) => void) {
        this.em.on('startDiscussion', listener);
    }

    onStartVote(listener: (endTime: number) => void) {
        this.em.on('startVote', listener);
    }

    onEndVote(listener: (data: {result: string, playerVotes: Record<string, string>}) => void) {
        this.em.on('endVote', listener);
    }

    onResumePlay(listener: () => void) {
        this.em.on('resumePlay', listener);
    }
}