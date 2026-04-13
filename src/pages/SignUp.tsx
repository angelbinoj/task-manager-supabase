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
import { supabase } from "@/lib/supabase"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

export default function SignUp() {

  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate()

  const handleSignUp = async () => {

  if (!email || !password || !name) {
    toast.error("All fields are required");
    return;
  }

  if (password.length < 6) {
    toast.error("Password must be at least 6 characters");
    return;
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    toast.error(error.message);
    return;
  }

  const id = data.user?.id;

  if (!id) {
    toast.error("User ID not found");
    return;
  }

  const { error: insertError } = await supabase
    .from('users')
    .insert([{ id, name, email }]);

  if (insertError) {
    toast.error("Error saving user");
    return;
  }

  toast.success("Signed Up successfully");
  navigate('/signIn');
};

  
  return (
    <div className="bg-blue-400 h-screen flex justify-center items-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-blue-500">Create an account</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-blue-500">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="m@example.com"
                  required
                />
              </div>
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
                  onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button onClick={()=>handleSignUp()} type="submit" className="w-full bg-blue-500 hover:bg-blue-400">
            SignUp
          </Button>
          <CardAction className="flex justify-center items-center w-full">
            <CardDescription>
              Already a User?
            </CardDescription>
            <Button onClick={() => navigate('/signIn')} className="text-blue-500" variant="link">Sign In</Button>
          </CardAction>
        </CardFooter>
      </Card>
    </div>
  )
}
