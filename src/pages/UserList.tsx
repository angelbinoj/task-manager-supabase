import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import avatar from "@/assets/avatar.jpg";

function UsersList() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
   const { data: { user } } = await supabase.auth.getUser();

const { data } = await supabase
  .from("users")
  .select("*")
  .neq("id", user?.id);

    setUsers(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center gap-1 min-h-screen">
        <p className="text-blue-600 font-semibold text-lg">Fetching Users...</p>
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">

      <div className="w-1/3 bg-blue-600 p-6 rounded-xl shadow-lg space-y-4">

        <h2 className="text-white text-xl font-bold text-center">
          Chat With
        </h2>

        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() =>
                navigate(`/message/${user.id}`)
              }
              className="flex items-center gap-3 bg-white p-3 rounded-lg cursor-pointer hover:bg-gray-200"
            >
              <img
                src={avatar}
                className="w-10 h-10 rounded-full"
              />
              <span className="font-medium">{user.name}</span>
            </div>
          ))}
        </div>

        {/* Back Button */}
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="w-full"
        >
          Back to Home
        </Button>

      </div>
    </div>
  );
}

export default UsersList;