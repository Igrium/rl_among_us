import React from 'react'

interface IProps {
    tasks: Record<string, boolean>
}

const TaskList: React.FunctionComponent<IProps> = ({ tasks }: IProps) => {

    const taskItems = Object.keys(tasks).map((taskID: string) => {
        if (tasks[taskID]) return <li key={taskID} style={{color: 'green'}}>{taskID}</li>
        else return <li key={taskID}>{taskID}</li>
    })

    return (
        <div>
            <h2>Tasks:</h2>
            <ul>
                {taskItems}
            </ul>
        </div>

    )
}

export default TaskList
