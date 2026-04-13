import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function SignIn() {

    
    const [email,setEmail]=useState<string>("");
    const [password,setPassword]=useState<string>("");
 const navigate=useNavigate()

    const handleSignIn =async()=>{
       if (!email || !password) {
     toast.error("Please fill all fields",{
       className: "text-red-600",
     });
    return;
  }

  if (!email.includes("@")) {
    toast.error("Enter valid email",{
      className: "text-red-600",
    });
    return;
  }

      try {           
let { data, error } = await supabase.auth.signInWithPassword({
  email,
  password
})

    if (error) {
     toast.error(error.message, {
      className: "text-red-600",
     });
      return;
  }
  console.log(data);
  toast.success("Logged in successfully",{
    className: "text-green-600",
  });
  navigate('/')
  
      } catch (error) {
        console.log("error signing in",error);
        
      }

    }



  return (
    <div className="bg-blue-400 h-screen flex justify-center items-center"> 
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-blue-500">Login to your account</CardTitle>
      </CardHeader>
      <CardContent>
        <form >
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-blue-500">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="m@example.com"
                required
                />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password" className="text-blue-500">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-blue-500 text-sm underline-offset-4 hover:underline"
                  >
                  Forgot your password?
                </a>
              </div>
              <Input id="password" type="password" value={password}
                onChange={(e) => setPassword(e.target.value)}  required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button onClick={()=>handleSignIn()} type="submit" className="w-full bg-blue-500 hover:bg-blue-400">
          Login
        </Button>
        <CardAction className="flex justify-center items-center w-full">
                    <CardDescription>
                      Not a User?
                    </CardDescription>
          <Button onClick={()=>navigate('/signUp')} className="text-blue-500" variant="link">Sign Up</Button>
        </CardAction>
      </CardFooter>
    </Card>
     </div>
  )
}
