import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8081/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  // Edit states
  const [editingId, setEditingId] = useState(null);
  const [editingTask, setEditingTask] = useState("");

  // GET all tasks
  const getTasks = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);
      const data = await response.json();

      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  // ADD task
  const addTask = async () => {
    if (task.trim() === "") return;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task: task,
          completed: false,
        }),
      });

      const newTask = await response.json();

      setTasks([...tasks, newTask]);
      setTask("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // COMPLETE / UNCOMPLETE task
  const toggleTask = async (id, completed, taskText) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task: taskText,
          completed: !completed,
        }),
      });

      const updatedTask = await response.json();

      setTasks(
        tasks.map((item) =>
          item.id === id ? updatedTask : item
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // START EDIT
  const startEdit = (item) => {
    setEditingId(item.id);
    setEditingTask(item.task);
  };

  // SAVE EDIT
  const saveEdit = async (id, completed) => {
    if (editingTask.trim() === "") return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task: editingTask,
          completed: completed,
        }),
      });

      const updatedTask = await response.json();

      setTasks(
        tasks.map((item) =>
          item.id === id ? updatedTask : item
        )
      );

      setEditingId(null);
      setEditingTask("");
    } catch (error) {
      console.error("Error editing task:", error);
    }
  };

  // CANCEL EDIT
  const cancelEdit = () => {
    setEditingId(null);
    setEditingTask("");
  };

  // DELETE task
  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      setTasks(
        tasks.filter((item) => item.id !== id)
      );
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // FILTER
  const filteredTasks = tasks.filter((item) => {
    if (filter === "active") {
      return !item.completed;
    }

    if (filter === "completed") {
      return item.completed;
    }

    return true;
  });

  const activeCount = tasks.filter(
    (item) => !item.completed
  ).length;

  const completedCount = tasks.filter(
    (item) => item.completed
  ).length;

  // ENTER KEY
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      addTask();
    }
  };

  // ENTER KEY FOR EDIT
  const handleEditKeyDown = (event, id, completed) => {
    if (event.key === "Enter") {
      saveEdit(id, completed);
    }

    if (event.key === "Escape") {
      cancelEdit();
    }
  };

  return (
    <div className="app">
      <div className="todo-container">

        {/* HEADER */}
        <div className="header">
          <div>
            <h1>My Todo List</h1>
            <p>
              Organize your day and get things done.
            </p>
          </div>

          <div className="task-summary">
            <span>{activeCount}</span>
            <small>Active</small>
          </div>
        </div>

        {/* ADD TASK */}
        <div className="add-task">
          <input
            type="text"
            placeholder="What do you need to do?"
            value={task}
            onChange={(event) =>
              setTask(event.target.value)
            }
            onKeyDown={handleKeyDown}
          />

          <button onClick={addTask}>
            + Add Task
          </button>
        </div>

        {/* FILTERS */}
        <div className="filters">

          <button
            className={
              filter === "all"
                ? "active-filter"
                : ""
            }
            onClick={() => setFilter("all")}
          >
            All <span>{tasks.length}</span>
          </button>

          <button
            className={
              filter === "active"
                ? "active-filter"
                : ""
            }
            onClick={() => setFilter("active")}
          >
            Active <span>{activeCount}</span>
          </button>

          <button
            className={
              filter === "completed"
                ? "active-filter"
                : ""
            }
            onClick={() => setFilter("completed")}
          >
            Completed{" "}
            <span>{completedCount}</span>
          </button>

        </div>

        {/* TASK LIST */}
        <div className="task-list">

          {loading && (
            <p className="message">
              Loading tasks...
            </p>
          )}

          {!loading &&
            filteredTasks.length === 0 && (
              <div className="empty-state">

                <div className="empty-icon">
                  ✓
                </div>

                <h2>No tasks here</h2>

                <p>
                  Add a task above and start
                  getting things done.
                </p>

              </div>
            )}

          {filteredTasks.map((item) => (

            <div
              className={`task-item ${
                item.completed
                  ? "completed"
                  : ""
              }`}
              key={item.id}
            >

              {/* CHECKBOX */}
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() =>
                  toggleTask(
                    item.id,
                    item.completed,
                    item.task
                  )
                }
              />

              {/* TASK TEXT / EDIT INPUT */}
              {editingId === item.id ? (

                <input
                  className="edit-input"
                  type="text"
                  value={editingTask}
                  onChange={(event) =>
                    setEditingTask(
                      event.target.value
                    )
                  }
                  onKeyDown={(event) =>
                    handleEditKeyDown(
                      event,
                      item.id,
                      item.completed
                    )
                  }
                  autoFocus
                />

              ) : (

                <span className="task-text">
                  {item.task}
                </span>

              )}

              {/* EDIT / SAVE / CANCEL */}
              {editingId === item.id ? (

                <>
                  <button
                    className="save-button"
                    onClick={() =>
                      saveEdit(
                        item.id,
                        item.completed
                      )
                    }
                  >
                    Save
                  </button>

                  <button
                    className="cancel-button"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>
                </>

              ) : (

                <button
                  className="edit-button"
                  onClick={() =>
                    startEdit(item)
                  }
                >
                  Edit
                </button>

              )}

              {/* DELETE */}
              <button
                className="delete-button"
                onClick={() =>
                  deleteTask(item.id)
                }
              >
                🗑
              </button>

            </div>

          ))}

        </div>

        {/* FOOTER */}
        {tasks.length > 0 && (

          <div className="footer">

            <span>
              {activeCount} task
              {activeCount !== 1
                ? "s"
                : ""}{" "}
              remaining
            </span>

            <span>
              {completedCount} completed
            </span>

          </div>

        )}

      </div>
    </div>
  );
}

export default App;