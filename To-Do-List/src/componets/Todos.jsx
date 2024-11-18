import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BsCircleFill,
  BsFillCheckCircleFill,
  BsTrashFill,
} from "react-icons/bs";
import { FaEdit } from "react-icons/fa";

const Todos = () => {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedText, setEditedText] = useState("");

  useEffect((e) => {
    const fetchTodos = async () => {
      try {
        const result = await axios.get("http://localhost:3000/get");
        console.log(result.data);
        setTodos(result.data);
      } catch (err) {
        console.error("Error fetching todos:", err);
      }
    };
    fetchTodos();
  }, []);

  const addTask = async () => {
    if (!task.trim()) {
      alert("Please enter your task");
      return;
    }
    try {
      const result = await axios.post("http://localhost:3000/add", { task });
      setTodos((prevTodos) => [...prevTodos, result.data]);
      setTask("");
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await axios.put(`http://localhost:3000/update/${id}`, {
        completed: !todos.find((todo) => todo._id === id).completed,
      });
      const updatedTodo = response.data;
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === id ? { ...todo, completed: updatedTodo.completed } : todo
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/delete/${id}`);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleSaveEdit = async (id) => {
    try {
      await axios.put(`http://localhost:3000/update/${id}`, {
        task: editedText,
        completed: todos.find((todo) => todo._id === id).completed,
      });
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === id ? { ...todo, task: editedText } : todo
        )
      );
      setEditingTaskId(null);
      setEditedText("");
    } catch (err) {
      console.log(err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  const handleEditKeyDown = (e, todoId) => {
    if (e.key === "Enter") {
      handleSaveEdit(todoId);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-tr from-black/[0.8] via-cyan-300 to-pink-300 flex items-center justify-center flex-col px-4 py-6 sm:px-8 md:px-12 lg:px-20">
      <div className="text-center p-8 bg-white bg-opacity-80 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-slate-400 text-3xl font-bold mb-4">To Do List</h2>
        <div className="flex gap-2 justify-between items-center flex-wrap">
          <input
            type="text"
            placeholder="Add your task here..."
            spellCheck="false"
            className="p-2 px-4 rounded-lg bg-white text-black border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-300 w-full sm:w-auto"
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={handleKeyDown}
            value={task}
          />
          <button
            className="bg-cyan-400 text-white px-4 py-2 rounded-lg hover:bg-cyan-500 transition w-full sm:w-auto mt-2 sm:mt-0"
            onClick={addTask}
          >
            Add
          </button>
        </div>
        <div className="w-full mt-5">
          {Array.isArray(todos) && todos.length === 0 ? (
            <h2>No todos to display</h2>
          ) : (
            Array.isArray(todos) &&
            todos.map((todo) => {
              return (
                <div
                  key={todo._id}
                  className="flex justify-between items-center w-full h-auto p-5 my-4 bg-gradient-to-tl from-cyan-200 to-black/[0.6] rounded-lg text-white overflow-hidden"
                >
                  <div className="flex gap-3 items-center flex-1">
                    {todo.completed ? (
                      <BsFillCheckCircleFill
                        onClick={() => handleEdit(todo._id)}
                      />
                    ) : (
                      <BsCircleFill onClick={() => handleEdit(todo._id)} />
                    )}
                    {editingTaskId === todo._id ? (
                      <input
                        type="text"
                        value={editedText}
                        spellCheck="false"
                        onChange={(e) => setEditedText(e.target.value)}
                        className="p-2 px-4 rounded-lg bg-gradient-to-tl from-cyan-200 to-black/[0.6] text-white outline-none border-none w-full sm:w-5/6 md:w-3/4 lg:w-2/3"
                        onKeyDown={(e) => handleEditKeyDown(e, todo._id)}
                      />
                    ) : (
                      <p
                        className={`flex-1 text-lg ${
                          todo.completed ? "line-through" : ""
                        } break-words`}
                        style={{ whiteSpace: "normal", wordWrap: "break-word" }}
                      >
                        {todo.task}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-4 items-center">
                    {editingTaskId === todo._id ? (
                      <button
                        onClick={() => handleSaveEdit(todo._id)}
                        className="text-green-500"
                      >
                        Save
                      </button>
                    ) : (
                      <FaEdit
                        className="w-5 h-5 cursor-pointer"
                        onClick={() => {
                          setEditingTaskId(todo._id);
                          setEditedText(todo.task);
                        }}
                      />
                    )}
                    <BsTrashFill
                      className="w-5 h-5 cursor-pointer"
                      onClick={() => handleDelete(todo._id)}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Todos;
