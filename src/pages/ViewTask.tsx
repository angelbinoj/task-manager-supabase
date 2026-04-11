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
  const {id } =useParams<{ id: string | undefined }>();
  
  const fetchTask =async()=>{ 
    const { data , error } = await supabase
      .from('tasks')
      .select('*')
      .eq("id", id)
      .single()

      if(error){
        console.log("error fetching tasks",error); 
      }else{
        setTask(data);
        console.log('Task fetched successfully');
        
      }
  }

  const handleDelete=async()=>{
    const { error } = await supabase
  .from('tasks')
  .delete()
  .eq('id', id)

   if(error){
        console.log("error deleting tasks",error); 
      }else{
        navigate('/')
      }
  }
  
  useEffect(() => {
    fetchTask()
  }, [])
if (!task) return <p className="text-center text-blue-600 font-bold font-serif mt-32">Loading...</p>;

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
