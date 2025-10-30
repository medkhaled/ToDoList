import React, { useState, useEffect } from 'react';
import './TodoList.css';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(setTodos);
  }, []);

  const addTodo = () => {
    if (!newTodo.trim()) return;
    fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTodo, description })
    })
      .then(() => {
        setNewTodo('');
        setDescription('');
        return fetch('/api/tasks');
      })
      .then(res => res.json())
      .then(setTodos);
  };

  const toggleCompleted = (id, completed) => {
    fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !completed })
    })
      .then(() => fetch('/api/tasks'))
      .then(res => res.json())
      .then(setTodos);
  };

  const deleteTodo = (id) => {
    fetch(`/api/tasks/${id}`, { method: 'DELETE' })
      .then(() => fetch('/api/tasks'))
      .then(res => res.json())
      .then(setTodos);
  };

  return (
    <div className="todo-container">
      <h1>📝 Todo List</h1>
      <div className="todo-form">
        <input
          type="text"
          placeholder="Titre"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={addTodo}>Ajouter</button>
      </div>
      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <div>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleCompleted(todo.id, todo.completed)}
              />
              <span className="todo-title">{todo.title}</span>
              <p className="todo-description">{todo.description}</p>
            </div>
            <button className="delete-button" onClick={() => deleteTodo(todo.id)}>
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;