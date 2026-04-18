import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
  return new Response("ok", { headers: corsHeaders });
}
  const { receiver_id, content } = await req.json();

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const authHeader = req.headers.get("Authorization");
  

if (!authHeader) {
  return new Response("Unauthorized", { status: 401, headers: corsHeaders });
}

  const userClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    {
      global: { headers: { Authorization: authHeader } },
    }
  );

  const { data: userData } = await userClient.auth.getUser();
const sender_id = userData.user?.id;

if (!sender_id) {
  return new Response("Unauthorized", { status: 401, headers: corsHeaders });
}

  const { data, error } = await supabase
    .from("messages")
    .insert({
      sender_id,
      receiver_id,
      content,
    })
    .select();

  return new Response(JSON.stringify({ data, error }), {
    headers: { ...corsHeaders,"Content-Type": "application/json" },
  });
});