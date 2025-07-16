"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Createtask from "../../componenet/createtask";
import EditTask from "../../componenet/editTask";
import Navbar from "../../componenet/navbar";
import { useUser } from "@/context/UserContext";
const Home = () => {
  const { user, token } = useUser();
  const [opencraetetask,setopencraetetask]=useState(false);
  const [taskss, setTaskss] = useState([]);
 console.log('user is',user)
  useEffect(() => {
    const featchData = async () => {
      const taskresponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/task/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );
      setTaskss(taskresponse.data.tasks);
    };
    featchData();
  }, []);
  console.log("tasks are", taskss);

  const [tasks, setTasks] = useState({
    pending: [],
    In_Progress: [],
    completed: []
  });
  useEffect(() => {
    const pendingTasks = taskss.filter((task) => task.status === "pending");
    const inProgressTasks = taskss.filter(
      (task) => task.status === "In_Progress"
    );
    const completedTasks = taskss.filter((task) => task.status === "completed");

    setTasks({
      pending: pendingTasks,
      In_Progress: inProgressTasks,
      completed: completedTasks
    });
  }, [taskss]);

  const [draggedTask, setDraggedTask] = useState(null);
  const [dragSource, setDragSource] = useState(null);

  const handleDragStart = (task, column) => {
    setDraggedTask(task);
    setDragSource(column);
  };

  const handleDrop = async (targetColumn) => {
  if (!draggedTask || dragSource === targetColumn) return;
  
  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/api/task/${draggedTask._id}`, 
      {
        status: targetColumn
      }, 
      {
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`
        }
      }
    );
    
    
    if (response.status >= 200 && response.status < 300) {
      const updatedTask = { ...tasks };
      updatedTask[dragSource] = updatedTask[dragSource].filter((task) => task._id !== draggedTask._id);
      updatedTask[targetColumn].push({
        ...draggedTask,
        status: targetColumn
      });
      setTasks(updatedTask);
      console.log("Task status updated successfully:", response.data);
    } else {
      console.error("Failed to update task status:", response.data);
    }
  } catch (error) {
    console.error("Error updating task status:", error);
  
  }
  setDraggedTask(null);
  setDragSource(null);
};

const DeleteTask=async(taskid)=>{
 const response= await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/api/task/${taskid}`, 
      {
        headers: {
          "Content-Type": "application/json",
        }
      }
    );
    if (response.status >= 200 && response.status < 300)
    {
      setTasks(prev=>({
        pending:prev.pending.filter(task=>task._id !== taskid),
        In_Progress:prev.In_Progress.filter(task=>task._id !== taskid),
        completed:prev.completed.filter(task=>task._id !== taskid),
      }))
      console.log('task deleted successfully')
    }

}



  const columns = [
    { id: "pending", title: "pending", color: "bg-purple-50 border-purple-200" },
    {
      id: "In_Progress",
      title: "In_Progress",
      color: "bg-blue-50 border-blue-200"
    },
    { id: "completed", title: "completed", color: "bg-green-50 border-green-200" }
  ];

  return (
    <>
    <Navbar/>
    <div className="p-6">
     <div className="md:flex block md:justify-between">
       <div className="mb-6 ">
        <h1 className="text-2xl font-bold text-gray-900">
          Task Management Board
        </h1>
        <p className="text-gray-600">
          Drag and drop tasks between columns to update their status
        </p>
        
      </div>
          <div className="flex gap-3">
            
   <h2 className="text-xl font-semibold text-gray-200 mb-6 justify-self-end"><Createtask/></h2>
          </div>
     </div>
      

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <div
            key={column.id}
            className={`rounded-lg border ${column.color} shadow-sm`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(column.id)}
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-800">{column.title}</h2>
                <span className="text-sm px-2 py-1 bg-white rounded-full text-gray-600">
                  {tasks[column.id]?.length}
                </span>
              </div>
            </div>

            <div className="p-4 min-h-96">
              {tasks[column.id]?.length === 0 ? (
                <div className="flex items-center justify-center h-24 border-2 border-dashed rounded-lg text-gray-400">
                  Drop tasks here
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks[column.id].map((task) => (
                    <div
                      key={task._id}
                      draggable
                      onDragStart={() => handleDragStart(task, column.id)}
                      className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm cursor-move hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-800">
                          {task.title}
                        </h3>
                        
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                      <button 
                      className=" text-[16px] w-auto text-red-600 py-1"
                      onClick={()=>DeleteTask(task._id)}
                      >Remove Task</button>
                      <h2 className="text-sm font-semibold text-gray-200  justify-self-end"><EditTask
                      taskid={task._id}
                      title={task.title}
                      description={task.description}
                      status={task.status}
                      dueDate={task.dueDate}
                      /></h2>
                     

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>#{task.id}</span>
                        <span>Drag to move</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default Home;
