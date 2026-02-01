import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import confetti from "canvas-confetti"; // ✅ Confetti import
import AddTaskForm from "../components/AddTaskForm";
import TaskCard from "../components/TaskCard";
import TaskFilter from "../components/TaskFilter";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");

  const token = localStorage.getItem("token");

  // Fetch tasks from backend
  const fetchTasks = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (error) {
      console.error("Fetch tasks error:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Add task + confetti
  const addTask = async ({ title, priority, category, dueDate }) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/tasks",
        { title, priority, category, dueDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Add task to state
      setTasks((prev) => [res.data, ...prev]);

      // 🎉 Confetti on add
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (error) {
      console.error("Add task error:", error);
    }
  };

  // Update task
  const updateTask = async (id, updatedData) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks((prev) =>
        prev.map((task) => (task._id === id ? res.data : task))
      );
    } catch (error) {
      console.error("Update task error:", error);
    }
  };

  // Toggle completed
  const toggleTask = async (id, completed) => {
    updateTask(id, { completed: !completed });
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      console.error("Delete task error:", error);
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  return (
    <div className="dashboard">
      <h2>Task Manager</h2>

      <AddTaskForm addTask={addTask} />
      <TaskFilter filter={filter} setFilter={setFilter} />

      <div className="tasks-container">
        {filteredTasks.length === 0 ? (
          <p>No tasks available</p>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              toggleTask={toggleTask}
              deleteTask={deleteTask}
              updateTask={updateTask} // ✅ inline edit support
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
