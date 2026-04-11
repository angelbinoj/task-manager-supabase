import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import type { Task } from "@/types/Task"
import { supabase } from "@/lib/supabase"

type Props = {
  task: Task
}

export default function UpdateTaskList({ task }: Props) {
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || "")
  const [status,setStatus] = useState(task.status)

  const handleUpdate = async() => {

    const { data, error } = await supabase
  .from('tasks')
  .update({ title, description ,status})
  .eq('id', task.id)
  .select()

   if(error){
      console.log("error updating task",error); 
    }else{
      console.log('Task updated successfully',data);
      
    }
    window.location.reload();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex-1 text-white font-semibold bg-orange-400 hover:bg-orange-300">
          Update
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-blue-700 font-bold">
            Update Task
          </DialogTitle>
        </DialogHeader>

        <FieldGroup className="bg-blue-600 p-6 rounded-xl space-y-4">
          
          <Field>
            <FieldLabel className="text-white">Task Title</FieldLabel>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white text-black"
            />
          </Field>

          <Field>
            
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-white text-black"
            />
          </Field>

          <Field>
            <div className="flex gap-2">
            <FieldLabel className=" text-white">Status : 
              <span className={status ? "bg-blue-300 text-green-700 px-1 rounded font-bold ml-1" : "bg-blue-300 text-red-600 px-1 rounded font-bold ml-1"}>
                {status ? "Completed" : "Pending"}
                </span>
            </FieldLabel>

            <Button size="sm" onClick={()=>setStatus(!status)}  className={status ? "hover:bg-slate-700" : "bg-green-500 hover:bg-green-400"}>
              {status? 'Undo' : ' Mark As Completed'}
             </Button>
            </div>
          </Field>

          <Field orientation="horizontal" className="flex gap-2">
            
            <DialogClose asChild>
              <Button variant="outline" className="flex-1">
                Cancel
              </Button>
            </DialogClose>

            <DialogClose asChild>
              <Button
                onClick={handleUpdate}
                className="flex-1 bg-white text-blue-700"
              >
                Update
              </Button>
            </DialogClose>

          </Field>

        </FieldGroup>
      </DialogContent>
    </Dialog>
  )
}