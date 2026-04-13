
import { Navigate, Route, Routes } from "react-router-dom"
import ViewTaskList from "./pages/ViewTaskList"
import AddTask from "./pages/AddTask"
import ViewTask from "./pages/ViewTask"
import SignUp from "./pages/SignUp"
import SignIn from "./pages/SignIn"
import { supabase } from "./lib/supabase"
import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { Toaster } from "sonner"

function App() {

   const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };

    getUser();

    const { data } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

      return () => {
    data.subscription.unsubscribe(); 
  };
    
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Routes>
        <Route path='/' index element={user ? <ViewTaskList /> : <Navigate to="/signIn" />} />
        <Route path='add' element={user ? <AddTask /> : <Navigate to="/signIn" />} />
        <Route path='view/:id' element={user ? <ViewTask /> : <Navigate to="/signIn" />} />
        <Route path='/signUp' element={<SignUp />} />
        <Route path='/signIn' element={<SignIn/>} />
    </Routes>
    <Toaster/>
    </>
  )
}

export default App