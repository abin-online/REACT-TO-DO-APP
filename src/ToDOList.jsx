import React, { useState, useEffect } from 'react';

function ToDoList() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [editIndex, setEditIndex] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    // Load tasks from local storage when the component mounts
    useEffect(() => {
        const savedTasks = JSON.parse(localStorage.getItem("tasks"));
        if (savedTasks) {
            setTasks(savedTasks);
        }
    }, []);

    // Save tasks to local storage whenever the tasks change
    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);

    function handleInputChange(event) {
        setNewTask(event.target.value);
    }

    function addTask() {
        const trimmedTask = newTask.trim();
    
        // Check if the task already exists, case-insensitive
        const taskExists = tasks.some(task => task.toLowerCase() === trimmedTask.toLowerCase());
    
        if (trimmedTask !== "") {
            if (taskExists) {
                setErrorMessage(`"${newTask}" is already in the list.`);
            } else {
                if (editIndex !== null) {
                    const updatedTasks = tasks.map((task, index) =>
                        index === editIndex ? trimmedTask : task
                    );
                    setTasks(updatedTasks);
                    setEditIndex(null);
                } else {
                    setTasks(t => [...t, trimmedTask]);
                }
                setNewTask("");
                setErrorMessage("");
            }
        }
    }
    
    function deleteTask(index) {
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);
    }

    function editTask(index) {
        setNewTask(tasks[index]);
        setEditIndex(index);
        setErrorMessage("");
    }

    function moveTaskUp(index) {
        if (index > 0) {
            const updatedTasks = [...tasks];
            [updatedTasks[index], updatedTasks[index - 1]] = 
                [updatedTasks[index - 1], updatedTasks[index]];
            setTasks(updatedTasks);
        }
    }

    function moveTaskDown(index) {
        if (index < tasks.length - 1) {
            const updatedTasks = [...tasks];
            [updatedTasks[index], updatedTasks[index + 1]] =
                [updatedTasks[index + 1], updatedTasks[index]];
            setTasks(updatedTasks);
        }
    }

    return (
        <div className="to-do-list">
            <h1>To-Do List</h1>
            <div>
                <div className='input'>
                <input
                    type="text"
                    placeholder='Enter a task'
                    value={newTask}
                    onChange={handleInputChange} />
                <button
                    className='add-button'
                    onClick={addTask}>
                    {editIndex !== null ? "Update Task" : "Add Task"}
                </button>
                </div>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            </div>

            <ol>
                {tasks.map((task, index) =>
                    <li key={index}>
                        <span className='text'>{task}</span>
                        <button
                            className='delete-button'
                            onClick={() => deleteTask(index)}>
                            Delete
                        </button>
                        <button
                            className='edit-button'
                            onClick={() => editTask(index)}>
                            Edit
                        </button>
                        <button
                            className='move-button'
                            onClick={() => moveTaskUp(index)}>
                            ⬆️
                        </button>
                        <button
                            className='move-button'
                            onClick={() => moveTaskDown(index)}>
                            ⬇️
                        </button>
                    </li>)}
            </ol>
        </div>
    );
}

export default ToDoList;
