import React, { useEffect, useState } from "react";

const TaskCard = ({ task, toggleTask, deleteTask, updateTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    priority: task.priority,
    category: task.category,
    dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
  });

  // ✅ Keep edit state in sync if task updates
  useEffect(() => {
    setEditData({
      title: task.title,
      priority: task.priority,
      category: task.category,
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
    });
  }, [task]);

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    !task.completed;

  const handleSave = () => {
    if (typeof updateTask !== "function") {
      console.error("updateTask is not a function");
      return;
    }

    updateTask(task._id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      title: task.title,
      priority: task.priority,
      category: task.category,
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
    });
    setIsEditing(false);
  };

  return (
    <div
      className={`task-card ${task.completed ? "completed" : ""} ${
        isOverdue ? "overdue" : ""
      }`}
    >
      <div className="task-info">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => toggleTask(task._id, task.completed)}
        />

        <div className="task-main">
          {isEditing ? (
            <>
              <input
                className="edit-input"
                value={editData.title}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
              />

              <div className="task-meta">
                <select
                  value={editData.priority}
                  onChange={(e) =>
                    setEditData({ ...editData, priority: e.target.value })
                  }
                >
                  <option value="low">low</option>
                  <option value="medium">medium</option>
                  <option value="high">high</option>
                </select>

                <input
                  value={editData.category}
                  onChange={(e) =>
                    setEditData({ ...editData, category: e.target.value })
                  }
                />

                <input
                  type="date"
                  value={editData.dueDate}
                  onChange={(e) =>
                    setEditData({ ...editData, dueDate: e.target.value })
                  }
                />
              </div>
            </>
          ) : (
            <>
              <span className="task-title">{task.title}</span>

              <div className="task-meta">
                {task.dueDate && (
                  <span className="task-date">
                    📅 {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}

                <span className={`task-priority ${task.priority}`}>
                  {task.priority}
                </span>

                <span className="task-category">{task.category}</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="task-actions">
        {isEditing ? (
          <>
            <button className="save-btn" onClick={handleSave}>✔</button>
            <button className="cancel-btn" onClick={handleCancel}>✖</button>
          </>
        ) : (
          <>
            <button
              className="edit-btn"
              onClick={() => setIsEditing(true)}
            >
              ✏️
            </button>
            <button
              className="delete-btn"
              onClick={() => deleteTask(task._id)}
            >
              ✕
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
