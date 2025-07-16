"use client"
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../../componenet/navbar";

const TaskList = () => {
  const [tasks, setTaskss] = useState([
  ]);
   useEffect(() => {
    const featchData = async () => {
      const taskresponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/task/`,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      setTaskss(taskresponse.data.tasks);
    };
    featchData();
  }, []);
  console.log("tasks are", tasks);

  const [filterStatus, setFilterStatus] = useState('all');
  const [SearchTask , setSearchTask] = useState(' ');

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-purple-100 text-purple-800';
      case 'In_Progress': return 'bg-blue-100 text-blue-800';
      case 'compleated': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'pending': return 'Pending';
      case 'In_Progress': return 'In Progress';
      case 'done': return 'Done';
      default: return status;
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filterStatus === 'all') return true;
    return task.status === filterStatus;
  });

  const sortedTasks = [...filteredTasks]
  .filter(task => {
    if (!SearchTask) return true;
      return task.title.toLowerCase().includes(SearchTask.toLowerCase()) ||
           task.description.toLowerCase().includes(SearchTask.toLowerCase());
  })
  .sort((a, b) => {
    
    return a.title.localeCompare(b.title);
  });

  return (
   <>
   <Navbar/>
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">

        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Task Board</h1>
        <p className="text-sm md:text-base text-gray-600">Manage and track your project tasks</p>
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <label htmlFor="filterStatus" className="block text-sm font-medium text-gray-900 mb-1">Filter by Status</label>
          <select 
            id="filterStatus" 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Tasks</option>
            <option value="pending">To Do</option>
            <option value="In_Progress">In Progress</option>
            <option value="compleated">Done</option>
          </select>
        </div>
        
        <div className="flex-1">
          <label htmlFor="SearchTask" className="block text-sm font-medium text-gray-700 mb-1">Search Task</label>
          <input
            placeholder="Enter task title..." 
            onChange={(e) => setSearchTask(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      
     <div className="hidden lg:block bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200">
          <div className="col-span-6 font-medium text-gray-700">Task</div>
          <div className="col-span-2 font-medium text-gray-700">Due Date</div>
          <div className="col-span-2 font-medium text-gray-700">Priority</div>
          <div className="col-span-2 font-medium text-gray-700">Status</div>
        </div>
        
     {sortedTasks.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No tasks match your filters
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {sortedTasks.map((task) => (
              <div key={task._id} className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50">
                <div className="col-span-6">
                  <h3 className="font-medium text-gray-800">{task.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                </div>
                
                <div className="col-span-2 flex items-center">
                  <span className="text-sm text-gray-700">{new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
                
                <div className="col-span-2 flex items-center">
                  <span className={`px-2 py-1 text-xs rounded-md capitalize ${getPriorityColor(task.priority || 'medium')}`}>
                    {task.priority || 'Medium'}
                  </span>
                </div>
                
                <div className="col-span-2 flex items-center">
                  <span className={`px-2 py-1 text-xs rounded-md ${getStatusColor(task.status)}`}>
                    {getStatusLabel(task.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="lg:hidden space-y-4">
        {sortedTasks.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
            No tasks match your filters
          </div>
        ) : (
          sortedTasks.map((task) => (
            <div key={task._id} className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium text-gray-800 text-lg">{task.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                </div>
                
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500 font-medium block">Due Date</span>
                    <span className="text-gray-700">{new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-gray-500 font-medium text-sm block mb-1">Priority</span>
                    <span className={`px-2 py-1 text-xs rounded-md capitalize ${getPriorityColor(task.priority || 'medium')}`}>
                      {task.priority || 'Medium'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium text-sm block mb-1">Status</span>
                    <span className={`px-2 py-1 text-xs rounded-md ${getStatusColor(task.status)}`}>
                      {getStatusLabel(task.status)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
   </>
  )
}

export default TaskList