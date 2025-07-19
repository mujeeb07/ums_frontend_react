import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ChangeEvent } from 'react';
import { useAppDispatch } from "../hooks/hooks";
import { useSelector } from "react-redux";
import { uploadImageToCloudinary } from "../config/cloudinary";
import { getAdminProfile, udpateCurrentUser } from "../features/users/userThunk";
import { logout } from "../features/auth/authThunk";
import { setUserLogout } from "../features/auth/authSlice";
import { Profile } from "../Components/Profile";
import { toggleTheme } from "../features/users/userSlice";
import { Bounce, ToastContainer, toast } from 'react-toastify';

export default function AdminProfile() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate()
    const { user, isLoading, error, isDarkTheme } = useSelector((state: any) => state.user);

    const [editMode, setEditMode] = useState(false);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        dispatch(getAdminProfile());
    }, [dispatch]);

    useEffect(() => {
        if (user) {
            setUsername(user.username || "");
            setEmail(user.email || "");
            setImageUrl(user.image || "");
        }
    }, [user]);

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const result = await uploadImageToCloudinary(file);
            console.log('Cloudinary result at the component:', result)
            if (result) {
                setImageUrl(result);
            }
        } catch (err) {
            console.error("Image upload failed", err);
            // toast("Image Upload Failed");
            toast.error(`${error}!`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                transition: Bounce,
                theme: "dark",
            });
        } finally {
            setUploading(false);
        }
    };

    const handleSave = () => {
        if (!user?._id) return;
        dispatch(udpateCurrentUser({
            userId: user._id,
            username,
            email,
            image: imageUrl,
            status: user.status,
        }))
        setEditMode(false);
    };

    const handleCancel = () => {
        setEditMode(false);
        setUsername(user?.username || "");
        setEmail(user?.email || "");
        setImageUrl(user?.image || "");
    };

    // Logout
    const handleLogout = () => {
        try {
            dispatch(logout());
            setUserLogout()
            navigate("/")
        } catch (error) {
            console.log(error)
        }
    }

    // Theme
    const handleTheme = () => {
        dispatch(toggleTheme(!isDarkTheme))
    }
    return (
        <div className={isDarkTheme ? "min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0f0c29] to-[#302b63] text-white"
            : "min-h-screen flex items-center justify-center bg-gradient-to-b from-[#eae8ff] to-[#9087f8] text-white"
        }>
            <div className={isDarkTheme ? "bg-[#1e1e2f] p-8 rounded-2xl shadow-2xl w-[400px]" :
                "bg-[#48487d] p-8 rounded-2xl shadow-2xl w-[400px]"
            }>
                <h2 className="text-2xl font-bold mb-6 text-center">Admin Profile</h2>
                {isLoading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className="text-red-400">{error}</p>
                ) : (
                    <>
                                <Profile
                                    imageUrl={imageUrl}
                                    editMode={editMode}
                                    username={username}
                                    email={email}
                                    uploading={uploading}
                                    setEditMode={setEditMode}
                                    handleLogout={handleLogout}
                                    setUsername={setUsername}
                                    setEmail={setEmail}
                                    handleFileChange={handleFileChange}
                                    handleSave={handleSave}
                                    handleCancel={handleCancel}
                                    handleTheme={handleTheme}
                                />

                    </>
                )}
                <button
                    className="w-full bg-green-600 hover:bg-green-700 py-2 rounded mt-4"
                    onClick={() => navigate("/admin/dashboard")}
                >
                    Go to dashboard
                </button>
                <button
                    className="w-0 bg-yellow-600 hover:bg-yellow-700 py-2 rounded mt-4"
                    onClick={handleTheme}
                >
                    
                </button>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
            />
        </div>
    );
}


