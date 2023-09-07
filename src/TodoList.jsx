import React, { useState } from "react";
import "./TodoList.scss";

function TodoList() {
  // Создаем состояние для хранения списка задач
  const [tasks, setTasks] = useState([]);
  // Создаем состояние для хранения списка завершенных задач
  const [activeTasks, setActiveTasks] = useState([]);
  // Создаем состояние для хранения списка завершенных задач
  const [completedTasks, setCompletedTasks] = useState([]);
  // Создаем состояние для хранения списка отложенных задач
  const [delayedTasks, setDelayedTasks] = useState([]);
  // Создаем состояние для хранения списка удаленных задач
  const [deletedTasks, setDeletedTasks] = useState([]);
  // Создаем состояние для хранения текущей задачи, которую пользователь вводит
  const [currentTask, setCurrentTask] = useState("");
  // Создаем состояние для выбранного фильтра
  const [filter, setFilter] = useState("all"); // 'all', 'completed', 'delayed', 'deleted'

  // Функция для добавления новой задачи в список
  const addTask = () => {
    if (currentTask.trim() !== "") {
      const newTask = { text: currentTask, status: "active" };
      setTasks([...tasks, newTask]);
      setActiveTasks([...activeTasks, newTask]);
      setCurrentTask("");
    }
  };

  // Функция для активации удаленной задачи
  const markAsActive = (index, taskList) => {
    const task = taskList[index];
    // Устанавливаем статус задачи "active"
    task.status = "active";

    // Обновляем состояние задач в списке активных задач
    const updatedActiveTasks = [...activeTasks, task];
    setActiveTasks(updatedActiveTasks);

    // Удаляем задачу из текущего списка (отложенных или удаленных)
    const updatedTasks = [...taskList];
    updatedTasks.splice(index, 1);

    // В зависимости от типа списка, обновляем соответствующее состояние
    if (taskList === delayedTasks) {
      setDelayedTasks(updatedTasks);
    } else if (taskList === deletedTasks) {
      setDeletedTasks(updatedTasks);
    }
  };

  // Функция для удаления задачи (как для отложенных, так и для удаленных задач)
  const deleteFromList = (index, taskList) => {
    const updatedTasks = [...taskList];
    updatedTasks.splice(index, 1);
    if (taskList === delayedTasks) {
      setDelayedTasks(updatedTasks);
    } else if (taskList === deletedTasks) {
      setDeletedTasks(updatedTasks);
    }
  };

  // Функция для отметки задачи как выполненной
const markAsCompleted = (index) => {
  const updatedTask = { ...tasks[index], status: "completed" };
  setCompletedTasks([...completedTasks, updatedTask]);
  updateTask(index, updatedTask, "completed");
  removeTask(index);
};

const markAsDelayed = (index) => {
  const updatedTask = { ...tasks[index], status: "delayed" };
  setDelayedTasks([...delayedTasks, updatedTask]);
  updateTask(index, updatedTask, "delayed");
  removeTask(index);
};

const deleteTask = (index) => {
  const updatedTask = { ...tasks[index], status: "deleted" };
  setDeletedTasks([...deletedTasks, updatedTask]);
  updateTask(index, updatedTask, "deleted");
  removeTask(index);
};


const updateTask = (index, updatedTask, status) => {
  const newTasks = [...tasks];
  newTasks[index] = updatedTask;
  setTasks(newTasks);

  // Если задача перемещается в статус "deleted", то удаляем ее из списка tasks
  if (status === "deleted") {
    removeTask(index);
  }
};

// Функция для удаления задачи из списка tasks
const removeTask = (index) => {
  const updatedTasks = [...tasks];
  updatedTasks.splice(index, 1);
  setTasks(updatedTasks);
};

  // Функция для фильтрации задач по статусу
  const filterTasks = (status) => {
    setFilter(status);
  };

  // Функция для отображения задач в соответствии с выбранным фильтром
  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") {
      return true;
    } else {
      return task.status === filter;
    }
  });

  console.log(tasks)

  return (
    <div className="main">
      <h1>To Do List</h1>
      <div className="input-cont">
        <div className="input-block">
          <input
            type="text"
            placeholder="Введите задачу"
            value={currentTask}
            onChange={(e) => setCurrentTask(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                addTask();
              }
            }}
          />
          <button className="add" onClick={addTask}>
            <img src="/icons/plus.svg" alt="" />
          </button>
        </div>

        <select onChange={(e) => filterTasks(e.target.value)}>
          <option value="all">Все задачи</option>
          <option value="active">Активные</option>
          <option value="completed">Завершенные</option>
          <option value="delayed">Отложенные</option>
          <option value="deleted">Удаленные</option>
        </select>
      </div>
      <div className="main-cont">
        {filter === "all" && (
          <div className="list-cont">
            <h2>Все задачи:</h2>
            <ul className="list-block">
              {tasks.map((task, index) => (
                <li key={index}>
                  {task.text}
                  {task.status === "active" && (
                    <div className="btns">
                      <button
                        className="check"
                        onClick={() => markAsCompleted(index)}
                      >
                        <img src="/icons/check.svg" alt="check" />
                      </button>
                      <button
                        className="delayed"
                        onClick={() => markAsDelayed(index)}
                      >
                        <img src="/icons/time.svg" alt="delayed" />
                      </button>
                      <button
                        className="delete"
                        onClick={() => deleteTask(index)}
                      >
                        <img src="/icons/delete.svg" alt="delete" />
                      </button>
                    </div>
                  )}
                </li>
              ))}
              {completedTasks.map((task, index) => (
                <li key={index}>
                  {task.text}
                </li>
              ))}
              {delayedTasks.map((task, index) => (
                <li key={index}>
                  {task.text}
                  <div className="btns">
                    <button
                      className="active"
                      onClick={() => markAsActive(index, delayedTasks)}
                    >
                      <img src="/icons/turn-on.svg" alt="activate" />
                    </button>
                    <button
                      className="delete"
                      onClick={() => deleteFromList(index, delayedTasks)}
                    >
                      <img src="/icons/delete.svg" alt="delete" />
                    </button>
                  </div>
                </li>
              ))}

              {deletedTasks.map((task, index) => (
                <li key={index}>
                  <p className="deleted">{task.text}</p>
                  <div className="btns">
                    <button
                      className="active"
                      onClick={() => markAsActive(index, deletedTasks)}
                    >
                      <img src="/icons/turn-on.svg" alt="activate" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {filter === "active" && (
          <div className="list-cont">
            <h2>Активные задачи:</h2>
            <ul className="list-block">
              {filteredTasks.map((task, index) => (
                <li key={index}>
                  {task.text}
                  <div className="btns">
                    <button
                      className="check"
                      onClick={() => markAsCompleted(index)}
                    >
                      <img src="/icons/check.svg" alt="check" />
                    </button>
                    <button
                      className="delayed"
                      onClick={() => markAsDelayed(index)}
                    >
                      <img src="/icons/time.svg" alt="delayed" />
                    </button>
                    <button
                      className="delete"
                      onClick={() => deleteTask(index)}
                    >
                      <img src="/icons/delete.svg" alt="delete" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {filter === "completed" && (
          <div className="list-cont">
            <h2>Завершенные задачи:</h2>
            <ul className="list-block">
              {completedTasks.map((task, index) => (
                <li key={index}>{task.text}</li>
              ))}
            </ul>
          </div>
        )}
        {filter === "delayed" && (
          <div className="list-cont">
            <h2>Отложенные задачи:</h2>
            <ul className="list-block">
              {delayedTasks.map((task, index) => (
                <li key={index}>
                  {task.text}
                  <div className="btns">
                    <button
                      className="active"
                      onClick={() => markAsActive(index, delayedTasks)}
                    >
                      <img src="/icons/turn-on.svg" alt="activate" />
                    </button>
                    <button
                      className="delete"
                      onClick={() => deleteFromList(index, delayedTasks)}
                    >
                      <img src="/icons/delete.svg" alt="delete" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {filter === "deleted" && (
          <div className="list-cont">
            <h2>Удаленные задачи:</h2>
            <ul className="list-block">
              {deletedTasks.map((task, index) => (
                <li key={index}>
                  <p className="deleted">{task.text}</p>
                  <div className="btns">
                    <button
                      className="active"
                      onClick={() => markAsActive(index, deletedTasks)}
                    >
                      <img src="/icons/turn-on.svg" alt="activate" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default TodoList;
