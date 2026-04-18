import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { useNavigate, useParams } from "react-router-dom";
import avatar from "@/assets/avatar.jpg";


function Messages() {
  const { id } = useParams<{ id: string | undefined }>();
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<any[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState<string>("");

  if (!id) return null;
  const receiver_id = id;

  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setUser(user);

    const { data } = await supabase
      .from("users")
      .select("name")
      .eq("id", receiver_id)
      .single();

    setName(data?.name);
  };

  const fetchMessages = async () => {
    if (!user || !id) return;

    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${user.id},receiver_id.eq.${id}),and(sender_id.eq.${id},receiver_id.eq.${user.id})`
      )
      .order("created_at", { ascending: true });

    setMessages(data || []);
    console.log(messages);

  };

  const handleAddMessage = async () => {
  if (!user || !id || !message.trim()) return;

  const { data, error } = await supabase.functions.invoke("send-message", {
    body: {
      sender_id: user.id,
      receiver_id,
      content: message,
    },
  });

  console.log(data);
  
  if (error) {
    console.error("Error sending message:", error);
    return;
  }
  console.log("Message sent:", data);
  setMessage(" ");
};

  useEffect(() => {
    fetchUser();
  }, [id]);

  useEffect(() => {
    if (user && id) {
      fetchMessages();
    }
  }, [user, id]);

  useEffect(() => {
    if (!user || !id) return;

    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const newMsg = payload.new;

          if (
            (newMsg.sender_id === user.id && newMsg.receiver_id === id) ||
            (newMsg.sender_id === id && newMsg.receiver_id === user.id)
          ) {
            setMessages((prev) => [...prev, newMsg]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, id]);


  return (
    <div className="flex flex-col justify-center items-center gap-2 min-h-screen bg-gray-100">
      <div className="w-1/3 items-start">

        <Button className="bg-blue-600 hover:bg-blue-500 text-white hover:text-white" variant="outline" onClick={() => navigate('/users')}>
          Back to list
        </Button>
      </div>
      <FieldGroup className="w-1/3 h-fit bg-blue-600 rounded-xl shadow-lg flex flex-col">

        <div className="p-4 flex gap-2 items-center border-b text-white font-bold">
          <img
            src={avatar}
            className="w-8 h-8 rounded-full"
          />
          <span> {name}</span>
        </div>

        <div className="flex-1 p-4 space-y-2 min-h-52 overflow-y-auto bg-gray-200">

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender_id === user?.id ? "justify-end" : "justify-start"
                }`}
            >
              <div
                className={`px-3 py-2 rounded-lg max-w-[70%] ${msg.sender_id === user?.id
                    ? "bg-blue-500 text-white"
                    : "bg-white text-black"
                  }`}
              >
                {msg.content}
                <div className="text-[10px] opacity-60 mt-1">
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}

        </div>

        <div className="p-3 flex gap-2 border-t rounded-b-2xl bg-blue-600">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="bg-white text-black"
          />
          <Button onClick={handleAddMessage} className="hover:bg-slate-700">Send</Button>
        </div>

      </FieldGroup>

    </div>
  )
}

export default Messages
