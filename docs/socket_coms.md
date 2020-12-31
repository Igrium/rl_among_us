# Socket Communications
## Intro
This document outlines the communication protocols between the game server and player clients. All of the communication happens through websockets using the events listed here.

---

## Server -> Client events

`disconnectWarning [reason: string]`

This is sent to a client if the server needs to disconnect it for any reason, followed by a disconnection from the server. The available reasons are available in `constants.ts`.

---

`updateRoster [data: {players: {name: string, color: string}[]}]`

Used while the server is in the waiting room, this is sent periodically to all clients with the current list of players.

`players`: A list with all the player names and colors.

---

`startGame [data: {roster: object, gameConfig: object, mapInfo: object}]`

This is sent to all clients by the server when the game starts. It contains a data object with the following information:

`roster`: A dictionary with all the player names as keys with whether they're an imposter or not as values.

`gameConfig`: The complete game configuration.

`mapInfo`: The complete map information json file.

---

`endGame [data: {impostersWin: boolean}]`

This is sent to all clients when the game ends. It contains a simple boolean containing whether the imposters won.

---

`updateTaskBar [value: number]`

This is sent to all clients at the beginning of the game, when a client completes a task. It contains a number fron 0-1 containing the percentage of the taskbar that is complete. Clients are expected to override their internal value with this value when they recieve it.

---

`updateTasks [tasks: object]`

This is sent to a client when it's task list is updated. It includes an object which is the new list with the task IDs as its keys and a boolean denoting whether they're done as its values.

---

`doTask [id: string] [callback: function({started: boolean})`

This is sent to the client when the server wants the client to start doing a task. It's usually never called unless the client requested to do that task. It contains a string with the task's ID and a callback function that confirms with the server that the task has been started.

The client should call this function when it recieves this message, regardless of whether it started the task or not. If using socket.io, all of the return connectivity is handled automagically under the hood. 

---

## Client -> Server events

**Note about initial connection:**

When connecting to the server, the client must send an additional `connectionInfo` query tag with the following formatting:

Players:
```json
{
    "connectionType": "player",
    "name": "player_name"
}
```
Game field computers:
```json
{
    "connectionType": "gameField",
    "id": "computer_id"
}
```
Obviously, replace "player_name" and "computer_id" with the player name and computer id.

---

`setColor [color: string]`

Tell the server to set the player's color. Color can only be set in the waiting room.

---

`requestTask [id: string]`

A client sends this to the server after it scans a task QR code and wants to perform the task. The only information sent is the task's ID. The client should not preemptively begin the task when this is sent; instead, it should wait for the server to instruct it to send `doTask`. 

---

`taskFinished [data: {aborted: boolean}]`

This is sent to the server when a client finishes a task, but it hasn't been QR code verified yet. When the server recieves this, it will stop the animated task, but it will only increase the task bar if the task doesn't require QR code verification.

The server is only listening for this event if it knows a client is doing a task, so it doesn't need the task ID.


Additionally, this message should also be sent if the client aborts the task for any reason; just make sure `aborted` = `true`.

---

`taskComplete [data: {canceled: boolean}]`

This message lets the server know that the client successfully QR code verified the task it was doing. Unless `canceled` = `true`. Then it means that the QR code verification failed.