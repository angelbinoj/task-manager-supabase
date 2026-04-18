import {
    Card,
} from "@/components/ui/card"
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { useRef } from "react";
import avatar from "@/assets/avatar.jpg";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function UpdateProfile() {
    const [user, setUser] = useState<any>({});
 const navigate = useNavigate();
    const fileRef = useRef<HTMLInputElement | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {

                const { data: { user } } = await supabase.auth.getUser();

                const { data ,error} = await supabase
                    .from("users")
                    .select("*")
                    .eq("id", user?.id)
                    .single()

                setUser(data || "");

                if (!user) {
                    return;
                }

                  if (error){
                    toast.error(error.message || "Something went wrong");
                  }

            } catch (error) {
                console.log("error:", error);
            }
        };


        loadData();
    }, []);

    const handleFileChange = async (e: any) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const allowedTypes = ["image/png", "image/jpeg"];
            if (!allowedTypes.includes(file.type)) {
                 toast.error("Only PNG or JPEG allowed");
                return;
            }

            // ✅ Size validation (2MB)
            const maxSize = 2 * 1024 * 1024;
            if (file.size > maxSize) {
                toast.error("File size must be less than 2MB");
                return;
            }
            setUploading(true);

           const folder = `user-${user.id}`;
const filePath = `${folder}/${file.name}`;

const { data } = await supabase.storage
    .from("avatars")
    .list(folder);

const exists = data?.some((f) => f.name === file.name);

if (!exists) {
    await supabase.storage
        .from("avatars")
        .upload(filePath, file);
}
            const { data: publicUrlData } = supabase.storage
                .from("avatars")
                .getPublicUrl(filePath);

            const imageUrl = publicUrlData.publicUrl;

            await supabase
                .from("users")
                .update({ image_url: imageUrl })
                .eq("id", user.id);

            setUser((prev: any) => ({ ...prev, image_url: imageUrl }));

        } catch (err) {
            console.log("Upload error:", err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            {/* <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-sm text-center"> */}
            <Card size="sm" className="mx-auto shadow-lg rounded-2xl p-6  text-center bg-blue-600 border-blue-800 border-2  space-y-2 w-full max-w-md">
                {/* Profile Image */}
                <div className="flex flex-col justify-center items-center my-6">
                    <img
                        src={user?.image_url ? user.image_url : avatar}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-2"
                    />
                <div className=" my-6">

                    <Input
                        type="file"
                        ref={fileRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                    />

                    {/* Upload button */}
                    <button
                        onClick={() => fileRef.current?.click()}
                        className="mt-3 bg-white text-black px-3 py-1 rounded-lg text-sm"
                    >
                        {uploading ? "Uploading..." : <span>{user?.image_url ? "Update Image" : "Upload Image"}</span>}
                    </button>
                </div>
                </div>

                {/* Name */}
                <div className="mb-4 text-left text-white">
                    <p className="text-sm text-slate-50">Name</p>
                    <p className="text-lg font-semibold">{user?.name}</p>
                </div>

                {/* Email */}
                <div className="text-left text-white">
                    <p className="text-sm text-slate-50">Email</p>
                    <p className="text-lg font-semibold">{user.email}</p>
                </div>

            <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="w-full hover:bg-slate-200"
        >
          Back to Home
        </Button>
            </Card >
        </div>

    );
}

export default UpdateProfile;