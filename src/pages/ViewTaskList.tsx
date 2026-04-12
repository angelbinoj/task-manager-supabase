
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import type { Task } from "@/types/Task";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";



function ListTasks() {
const [tasks,setTasks]=useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

const fetchTasks =async()=>{

  try {
       setLoading(true);
    const { data ,error} = await supabase
      .from('tasks')
      .select('*')

       if (error) {
    throw error;
  }

      setTasks(data as Task[] || []);
         setLoading(false);
       console.log('Tasks fetched successfully');

  } catch (error) {
    console.log("error fetching tasks",error); 
    
  }
}

useEffect(() => {
  fetchTasks()
}, [])



  const navigate=useNavigate();

  const handleClick = (id: number |string) => {
  navigate(`/view/${id}`);
}

 if (loading) {
    return (
      <div className="flex justify-center items-center gap-1 min-h-screen">
      <p className="text-blue-600 font-semibold text-lg">Fetching task...</p>
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

  return (
    <div className="w-full h-screen bg-gray-100 p-6">
      
      {/* Heading */}
      <h1 className="text-3xl font-bold text-blue-700 text-center mb-10">
        ToDoList
      </h1>

      {/* Table Container */}
      <div className="max-w-3xl mx-auto bg-blue-600 rounded-xl shadow-md p-4">
        <Button className="text-blue-600" variant="outline" onClick={()=>navigate('/add')}>
          Add Task <span className=" text-2xl">+</span>
        </Button>
        <table className="w-full text-white">
          
          {/* Table Head */}
          <thead>
            <tr className="text-left border-b border-blue-400">
              <th className="py-2">SI.No</th>
              <th className="py-2">Title</th>
              <th className="py-2">Action</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {tasks.map((task, index) => (
              <tr key={task.id} className="border-b border-blue-500">
                
                <td className="py-2">{index + 1}</td>
                
                <td className="py-2">{task.title}</td>
                
                <td className="py-2">
                  <Button onClick={()=>handleClick(task.id)} size="sm" variant="secondary">
                    View
                  </Button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </div>
  );
}

export default ListTasks;