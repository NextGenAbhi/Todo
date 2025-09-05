import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, CheckCircle2, Circle, Trash2, Edit3, Save, X, LogOut, User } from 'lucide-react';
import { getTasks, addTask, updateTask, deleteTask, toggleTask } from '../utils/storage.js';
import { logoutUser, getCurrentUser } from '../utils/auth.js';

const TodoApp = ({ onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, completed
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    try {
      const savedTasks = getTasks();
      setTasks(savedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    setIsLoading(true);
    try {
      const task = addTask(newTask.trim());
      if (task) {
        setTasks(prev => [...prev, task]);
        setNewTask('');
      }
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleTask = (taskId) => {
    try {
      if (toggleTask(taskId)) {
        setTasks(prev => prev.map(task => 
          task.id === taskId ? { ...task, completed: !task.completed } : task
        ));
      }
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const handleDeleteTask = (taskId) => {
    try {
      if (deleteTask(taskId)) {
        setTasks(prev => prev.filter(task => task.id !== taskId));
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleEditStart = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const handleEditSave = (taskId) => {
    if (!editText.trim()) return;

    try {
      if (updateTask(taskId, { text: editText.trim() })) {
        setTasks(prev => prev.map(task => 
          task.id === taskId ? { ...task, text: editText.trim() } : task
        ));
        setEditingId(null);
        setEditText('');
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleLogout = () => {
    logoutUser();
    onLogout();
  };

  // Filter and search tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.text.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (filter) {
      case 'active':
        return !task.completed && matchesSearch;
      case 'completed':
        return task.completed && matchesSearch;
      default:
        return matchesSearch;
    }
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(task => task.completed).length,
    active: tasks.filter(task => !task.completed).length
  };

  const currentUser = getCurrentUser();

  return (
    <div className="todo-app">
      <div className="todo-container">
        <header className="todo-header">
          <div className="header-top">
            <div className="header-title">
              <h1>My Todo List</h1>
              <div className="user-info">
                <User size={16} />
                <span>{currentUser}</span>
              </div>
            </div>
            <button onClick={handleLogout} className="logout-button" title="Logout">
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>

          <div className="stats-container">
            <div className="stat-item">
              <span className="stat-number">{stats.total}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.active}</span>
              <span className="stat-label">Active</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.completed}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>
        </header>

        <div className="todo-controls">
          <form onSubmit={handleAddTask} className="add-task-form">
            <div className="input-wrapper">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a new task..."
                disabled={isLoading}
              />
              <button type="submit" disabled={isLoading || !newTask.trim()}>
                <Plus size={20} />
              </button>
            </div>
          </form>

          <div className="filters-and-search">
            <div className="search-wrapper">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tasks..."
              />
            </div>

            <div className="filter-buttons">
              <button 
                className={filter === 'all' ? 'active' : ''}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button 
                className={filter === 'active' ? 'active' : ''}
                onClick={() => setFilter('active')}
              >
                Active
              </button>
              <button 
                className={filter === 'completed' ? 'active' : ''}
                onClick={() => setFilter('completed')}
              >
                Completed
              </button>
            </div>
          </div>
        </div>

        <div className="tasks-container">
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              {tasks.length === 0 ? (
                <>
                  <Circle size={48} className="empty-icon" />
                  <h3>No tasks yet</h3>
                  <p>Add your first task to get started!</p>
                </>
              ) : (
                <>
                  <Search size={48} className="empty-icon" />
                  <h3>No tasks found</h3>
                  <p>Try adjusting your search or filter.</p>
                </>
              )}
            </div>
          ) : (
            <ul className="task-list">
              {filteredTasks.map(task => (
                <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                  <button
                    className="task-toggle"
                    onClick={() => handleToggleTask(task.id)}
                    aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    {task.completed ? (
                      <CheckCircle2 size={20} className="check-icon completed" />
                    ) : (
                      <Circle size={20} className="check-icon" />
                    )}
                  </button>

                  <div className="task-content">
                    {editingId === task.id ? (
                      <div className="edit-form">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleEditSave(task.id);
                            if (e.key === 'Escape') handleEditCancel();
                          }}
                          autoFocus
                        />
                        <div className="edit-buttons">
                          <button onClick={() => handleEditSave(task.id)} className="save-button">
                            <Save size={16} />
                          </button>
                          <button onClick={handleEditCancel} className="cancel-button">
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <span className="task-text">{task.text}</span>
                        <div className="task-meta">
                          <span className="task-date">
                            {new Date(task.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {editingId !== task.id && (
                    <div className="task-actions">
                      <button
                        onClick={() => handleEditStart(task)}
                        className="edit-button"
                        aria-label="Edit task"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="delete-button"
                        aria-label="Delete task"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoApp;
