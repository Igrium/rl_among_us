import React from 'react'

interface IProps {
    tasks: Record<string, boolean>,
    onTaskClicked?: (taskID: string) => void
}

const TestTaskDisplay: React.FunctionComponent<IProps> = ({ tasks, onTaskClicked }: IProps) => {
    function entry(taskID: string) {
        if (tasks[taskID]) return <b>{tasks[taskID]}</b>
        else return taskID;
    }

    function handlePress(taskID: string) {
        console.log(`Task clicked: ${taskID}`);
        if (onTaskClicked) {
            onTaskClicked(taskID);
        }
    }

    const taskItems = Object.keys(tasks).map((taskID: string) => {
        return <li key={taskID}><button onClick={() => handlePress(taskID)}>{entry(taskID)}</button></li>
    } )
    return (
        <div>
            <h2>Tasks:</h2>
            <ul>
                {taskItems}
            </ul>
        </div>
    )
}

export default TestTaskDisplay
