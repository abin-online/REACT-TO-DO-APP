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
        if (newTask.trim() !== "") {
            // Check if the task already exists in the list
            if (tasks.includes(newTask.trim().toLowerCase())) {
                setErrorMessage(`"${newTask}" is already in the list.`);
            } else {
                if (editIndex !== null) {
                    // Update the existing task
                    const updatedTasks = tasks.map((task, index) =>
                        index === editIndex ? newTask : task
                    );
                    setTasks(updatedTasks);
                    setEditIndex(null); // Reset the edit index after updating
                } else {
                    // Add a new task
                    setTasks(t => [...t, newTask]);
                }
                setNewTask(""); // Clear the input field after adding or updating
                setErrorMessage(""); // Clear any previous error message
            }
        }
    }

    function deleteTask(index) {
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);
    }

    function editTask(index) {
        setNewTask(tasks[index]); // Load the task into the input field
        setEditIndex(index); // Set the index to be edited
        setErrorMessage(""); // Clear any previous error message
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
