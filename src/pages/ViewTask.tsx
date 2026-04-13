import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FieldLabel } from "@/components/ui/field";
import UpdateTaskList from "@/components/UpdateTaskList";
import { supabase } from "@/lib/supabase";
import type { Task } from "@/types/Task";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"


export default function ViewTask() {
  const navigate=useNavigate()
  const [task,setTask]=useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const {id } =useParams<{ id: string | undefined }>();
  
  const fetchTask =async()=>{ 
    try {
      setLoading(true);
      const { data ,error} = await supabase
        .from('tasks')
        .select('*')
        .eq("id", id)
        .single()


         if (error) {
    throw error;
  }
      
        setTask(data);
        setLoading(false);
        console.log('Task fetched successfully');
    } catch (error) {
      console.log("error fetching tasks",error); 
      
    }

  }

  const handleDelete=async()=>{

    try {
      const { error} = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)
    
    if (error) {
    throw error;
  }
    navigate('/')
      
    } catch (error){
      console.log("error deleting tasks",error); 
      
    }
  }
  
  useEffect(() => {
    fetchTask()
  }, [])
  
  if (loading) {
    return (
      <div className="flex justify-center items-center gap-1 min-h-screen">
      <p className="text-blue-600 font-semibold text-lg">Fetching task...</p>
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
if (!task) return <p className="text-center text-blue-600 font-bold font-serif mt-32">Task not found!</p>;


  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-200">
    <Card size="sm" className="mx-auto bg-blue-600 shadow-lg rounded-xl border-blue-800 border-2  space-y-2 w-full max-w-md">
      <CardHeader className="space-y-2">
        <CardTitle className="text-white font-bold ">Task Title</CardTitle>
        <CardDescription className="text-slate-100 text-xl ">
          {task.title}
        </CardDescription>
      </CardHeader>
      <CardContent>
       <CardTitle className="text-white font-bold mb-2">Description of the task</CardTitle>
        <CardDescription className="text-slate-100 wrap-break-word whitespace-normal leading-relaxed">
          {task.description}
        </CardDescription>
        {task.status ?
        
        <FieldLabel className=" mt-4 bg-blue-300 text-green-600 p-1 rounded font-bold" htmlFor="textarea-message">Completed</FieldLabel> : 
        <FieldLabel className=" mt-4 bg-blue-300 text-red-600 p-1 rounded font-bold" htmlFor="textarea-message">Pending</FieldLabel>
        }
        
      </CardContent>
      <CardFooter className="flex justify-center gap-2 w-full py-2">
           <UpdateTaskList task={task}/>
        <Button onClick={() =>handleDelete()} size="sm" className="flex-1 h-8 bg-red-500 text-white font-bold hover:bg-red-300">
          Delete
        </Button>
      </CardFooter>
    </Card>
    <Button onClick={() =>navigate('/')} variant="outline" size="sm" className="w-full max-w-md mt-3 h-8 bg-gray-800 text-white text-md font-bold hover:text-sm hover:text-slate-50 hover:bg-gray-700">
          Back to list
        </Button>
</div>
  )
}
