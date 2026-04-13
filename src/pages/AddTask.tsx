import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/lib/supabase";


function AddTask () {

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
   const navigate=useNavigate();
   

     
const handleAddTask = async () => {
  try {

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.log("User not logged in");
      return;
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert([
        {
          title,
          description,
          user_id: user.id, 
        },
      ])
      .select();

    if (error) throw error;

    console.log("Task Added Successfully", data);
    navigate("/");

  } catch (error) {
    console.log("error inserting tasks", error);
  }
};


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
  
    <FieldGroup className="w-1/3 bg-blue-600 p-6 rounded-xl shadow-lg border space-y-4">
      <Field>
        <FieldLabel className="text-white font-bold" htmlFor="fieldgroup-title">Task Title</FieldLabel>
        <Input id="fieldgroup-title" value={title}
      onChange={(e) => setTitle(e.target.value)} className="bg-white text-black border-gray-300 placeholder:text-gray-400" placeholder="Enter a title for task" />
      </Field>
       <Field>
      <FieldLabel className="text-white font-bold" htmlFor="textarea-message">Description</FieldLabel>
      <FieldDescription className="text-slate-200 font-bold">Enter a short description of your task below.</FieldDescription>
      <Textarea id="textarea-message" value={description}
      onChange={(e) => setDescription(e.target.value)} placeholder="Type your description here." className="bg-white text-black border-gray-300 placeholder:text-gray-400"/>
    </Field>
      <Field orientation="horizontal">
        <Button type="reset" onClick={()=>navigate('/')} variant="outline">
          Cancel
        </Button>
        <Button onClick={()=>handleAddTask()} type="submit">Add Task</Button>
      </Field>
    </FieldGroup>
    </div>
  )
}

export default AddTask
