import React from "react";

const TaskFilter = ({ filter, setFilter }) => {
  return (
    <div className="task-filter">
      <button
        className={`all ${filter === "all" ? "active" : ""}`}
        onClick={() => setFilter("all")}
      >
        All
      </button>

      <button
        className={`completed ${filter === "completed" ? "active" : ""}`}
        onClick={() => setFilter("completed")}
      >
        Completed
      </button>

      <button
        className={`pending ${filter === "pending" ? "active" : ""}`}
        onClick={() => setFilter("pending")}
      >
        Pending
      </button>
    </div>
  );
};

export default TaskFilter;
