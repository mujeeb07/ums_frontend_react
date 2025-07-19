import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { User } from "lucide-react";


interface ProfileProps {
    imageUrl: string;
    editMode: boolean;
    username: string;
    email: string;
    uploading: boolean;
    setEditMode: (value: boolean) => void;
    handleLogout: () => void;
    setUsername: (value: string) => void;
    setEmail: (value: string) => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSave: () => void;
    handleCancel: () => void;
    handleTheme: () => void;
}

export const Profile: React.FC<ProfileProps> = ({
    imageUrl,
    editMode,
    username,
    email,
    uploading,
    setEditMode,
    handleLogout,
    setUsername,
    setEmail,
    handleFileChange,
    handleSave,
    handleCancel,
    handleTheme,
}) => {
    const isDarkTheme = useSelector((state: RootState) => state.user.isDarkTheme);
    return (
        <>
            <div className="flex justify-center mb-4">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt="User"
                        className={
                            isDarkTheme
                                ? "rounded-full w-28 h-28 object-cover border-4 border-gray-600"
                                : "rounded-full w-28 h-28 object-cover border-4 border-gray-400"
                        }
                    />
                ) : (
                    <div
                        className={
                            isDarkTheme
                                ? "rounded-full w-28 h-28 flex items-center justify-center bg-gray-700 border-4 border-gray-600"
                                : "rounded-full w-28 h-28 flex items-center justify-center bg-gray-200 border-4 border-gray-400"
                        }
                    >
                            <User size={40} />
                    </div>
                )}
            </div>

            {!editMode ? (
                <>
                    <p className="text-center text-lg font-semibold">{username}</p>
                    <p className="text-center text-sm text-gray-300 mb-4">{email}</p>

                    <button
                        className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded mt-4"
                        onClick={() => setEditMode(true)}
                    >
                        Edit Profile
                    </button>
                    <button
                        className="w-full bg-red-600 hover:bg-red-700 py-2 rounded mt-4"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                    <button
                        className="w-full bg-yellow-600 hover:bg-yellow-700 py-2 rounded mt-4"
                        onClick={handleTheme}
                    >
                        Theme
                    </button>
                </>
            ) : (
                <div className="space-y-3">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 rounded"
                        placeholder="Username"
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 rounded"
                        placeholder="Email"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="text-sm"
                    />
                    {uploading && (
                        <p className="text-xs text-yellow-300">Uploading image...</p>
                    )}

                    <div className="flex justify-between mt-4">
                        <button
                            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                            onClick={handleSave}
                        >
                            Save
                        </button>
                        <button
                            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};
