import { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { Search, Plus, Edit, Trash2, Shield, ShieldOff, User, Mail, UserCheck } from "lucide-react";
import {
    updateUserStatus,
    createNewUser,
    updateUserByAdmin,
    getAllUsers,
    deleteUserByAdmin,
    // searchUsers
} from "../features/admin/adminThunk";
import {
    reloadUsers,
    setUsers,
    toggleStatus,
    updateUser
} from "../features/admin/adminSlice";
import { useNavigate } from "react-router-dom";
import DeleteUserModal from "../Components/DeleteModal";
import { Bounce, ToastContainer, toast } from 'react-toastify';


interface UserType {
    _id: string;
    username: string;
    email: string;
    password?: string;
    role: string;
    status: boolean;
    image?: string;
}

export interface UserFormData {
    userId?: string;
    username: string; 
    email: string;
    password?: string;
    image?: string;
    role: string;
    status: boolean;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

interface UserFormProps {
    formData: UserFormData;
    setFormData: (data: UserFormData) => void;
    onSubmit: () => void;
    onCancel: () => void;
    isEdit?: boolean;
}

const usersPerPage = 7;

// Reusable Modal Component
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-gradient-to-b from-[#0f0c29]/60 to-[#302b63]/60 flex items-center justify-center z-50">
            <div className="bg-[#1e1e2f] rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-white">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white text-2xl transition-colors"
                    >
                        ×
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

// User form component
const UserForm: React.FC<UserFormProps> = ({ formData, setFormData, onSubmit, onCancel, isEdit = false }) => (
    <div className="space-y-4">
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
            </label>
            <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-2 bg-[#2e2e3e] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
                placeholder="Enter username"
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
            </label>
            <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 bg-[#2e2e3e] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
                placeholder="Enter email"
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
            </label>
            <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`w-full px-4 py-2 rounded-md focus:outline-none border ${isEdit
                        ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                        : "bg-[#2e2e3e] text-white focus:ring-2 focus:ring-blue-500 border-gray-600"
                  }`}
                placeholder="Enter Password"
                disabled={ isEdit ? true : false }
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
                Status
            </label>
            <select
                value={formData.status ? "active" : "blocked"}
                onChange={(e) => setFormData({ ...formData, status: e.target.value === "active" })}
                className="w-full px-4 py-2 bg-[#2e2e3e] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
            >
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
            </select>
        </div>
        <div className="flex space-x-3 pt-6">
            <button
                onClick={onSubmit}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-semibold"
            >
                {isEdit ? "Update User" : "Add User"}
            </button>
            <button
                onClick={onCancel}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors font-semibold"
            >
                Cancel
            </button>
        </div>
    </div>
);

const AdminDashboard: React.FC = () => {
    const dispatch = useAppDispatch();
    const { users, isLoading, error } = useAppSelector((state) => state.admin);

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [showUserModal, setShowUserModal] = useState<boolean>(false);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

    // Delete Modal state
    const [isDeleteModalOpen, setIsDeleteMdodal] = useState<boolean>(false);

    // form data for  add and edit
    const [formData, setFormData] = useState<UserFormData>({
        username: "",
        email: "",
        role:"",
        status: true
    });

    // Pagination setup
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await dispatch(getAllUsers({ page: currentPage, limit: usersPerPage })).unwrap();
                console.log("Received:", response);
                const { users, total } = response
                dispatch(setUsers(users))
                setTotalPages(total)
            } catch (err) {
                console.error("Failed to fetch users:", err);
                toast.error("Failed to fetch users")
            }
        };

        fetchUsers();
    }, [dispatch, currentPage]);

    const filteredUsers = useMemo(() => {
        if (!users) return [];

        const mappedUsers: UserType[] = users.map((user) => ({
            ...user,
            role: (user.role === 'admin' || user.role === 'user' ? user.role : 'user') as 'user' | 'admin',
            status: (user as any).status ?? true,
        }));

        return mappedUsers.filter(user =>
            user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    const resetForm = () => {
        setFormData({
            username: "",
            email: "",
            password: "",
            role: "user",
            status: true
        });
    };

    const handleAddUser = () => {
        setIsEditMode(false);
        setSelectedUser(null);
        resetForm();
        setShowUserModal(true);
    };

    const handleEditUser = (user: UserType) => {
        setIsEditMode(true);
        setSelectedUser(user);
        setFormData({
            username: user.username,
            email: user.email,
            role: user.role,
            status: user.status
        });
        setShowUserModal(true);
    };
    
    const validateFormData = () => {
        if (!formData.username?.trim()) {
            toast.error("Username is required");
            return false;
        }
        if (!formData.email?.trim()) {
            toast.error("Email is required");
            return false;
        }
        if (!formData.password?.trim() && !isEditMode) {
            toast.error("Password is required");
            return false
        }
        return true
    }
   
    const handleSubmit = async () => {
        try {
            if (isEditMode) {
                if (selectedUser?._id) {
                    console.log("Updating user:", formData, "Selected user:", selectedUser);
                    if (!validateFormData()) return
                    else {
                        const updatedUserFormData = { ...formData, userId: selectedUser?._id }
                        const response = await dispatch(
                            updateUserByAdmin(updatedUserFormData)).unwrap()
                        dispatch(updateUser(response))
                        toast("Updated User Data");
                        navigate("/admin/dashboard")
                    }
                }
            } else {
                console.log("Adding user:", formData);
                if(!validateFormData()) return
                const response = await dispatch(createNewUser({ formData })).unwrap();
                console.log(response)
                toast.success("New user added");
            }
        } catch (error) {
            if (isEditMode) {
                toast.error("Update user failed, Try again.");
            } else {
                toast.error("Register User failed, Try again.");
            }
            console.log(error)
            return; 
        }
        handleCloseModal();
    };

    // Delete Handler
    const handleDelete = async (userId: string) => {
        setIsDeleteMdodal(true);
        const user = users.find((user) => user._id == userId);
        if (user) {
            setSelectedUser(user)
        }
    }

    const handleConfirmDelete = async () => {
        try {
            const selectedUserData = users.find((user) => user._id == selectedUser?._id);
            if (selectedUserData) {
                const response = await dispatch(deleteUserByAdmin(selectedUserData._id)).unwrap();
                console.log(response, "say")
                dispatch(reloadUsers(response.user._id));
                setSelectedUser(null);
                setIsDeleteMdodal(false)
               await dispatch(getAllUsers({page:1,limit:5}))
            }
        } catch (error) {
            console.log(error, "erro deleting user");
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
        }
    }
    
    const handleToggleUserStatus = async (userId: string) => {
        const response = await dispatch(updateUserStatus({ userId: userId })).unwrap()
        dispatch(toggleStatus(response))
    };

    const handleCloseModal = () => {
        setShowUserModal(false);
        setIsEditMode(false);
        setSelectedUser(null);
        resetForm();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#0f0c29] to-[#302b63] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-300">Loading users...</p>
                </div>
            </div>
        );
    }

    if (error) {    
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#0f0c29] to-[#302b63] flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-red-900 border border-red-700 text-red-300 px-9 py-7 rounded-lg">
                        <p className="font-medium">Error loading users</p>
                        <p className="text-sm">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
    
        <div className="min-h-screen bg-gradient-to-b from-[#0f0c29] to-[#302b63] text-white">
            {/* Header */}
            <div className="bg-[#1e1e2f] shadow-xl border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <UserCheck className="h-8 w-8 text-blue-400 mr-3" />
                                <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search and Add User Section */}
                <div className="bg-[#1e1e2f] rounded-2xl shadow-xl border border-gray-700 mb-6">
                    <div className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search users by name, email, or role..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-[#2e2e3e] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
                                />
                            </div>
                            <button
                                onClick={handleAddUser}
                                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-semibold"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Add User</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-[#1e1e2f] rounded-2xl shadow-xl border border-gray-700 overflow-hidden">

                    <div className="overflow-x-auto">

                        {filteredUsers.length === 0 ? (
                            <div className="text-center py-12">
                                <User className="mx-auto h-12 w-12 text-gray-500" />
                                <h3 className="mt-4 text-sm font-medium text-gray-300">No users found</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding a new user'}
                                </p>
                            </div>
                        ) : (
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-[#2e2e3e]">
                                <tr>
                                    <th className="px-8 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        <div className="flex items-center space-x-1">
                                            <User className="h-4 w-4" />
                                            <span>User</span>
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        <div className="flex items-center space-x-1">
                                            <Mail className="h-4 w-4" />
                                            <span>Email</span>
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-10 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-[#1e1e2f] divide-y divide-gray-700">
                                {filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-[#2e2e3e] transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-blue-900 overflow-hidden flex items-center justify-center border border-blue-700">
                                                    {user?.image ? (
                                                        <img src={user.image} alt="" className="w-full h-full object-cover rounded-full" />
                                                    ) : (
                                                        <span className="text-blue-300 font-medium text-sm">
                                                            {user.username?.charAt(0).toUpperCase()}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-white">
                                                        {user.username}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-300">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${user.role === 'admin'
                                                ? 'bg-purple-900 text-purple-300 border border-purple-700'
                                                : 'bg-green-900 text-green-300 border border-green-700'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${user.status
                                                    ? 'bg-green-900 text-green-300 border border-green-700'
                                                    : 'bg-red-900 text-red-300 border border-red-700'
                                                    }`}
                                            >
                                                {user.status ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => handleEditUser(user)}
                                                    className="text-blue-400 hover:text-blue-300 p-2 rounded-md hover:bg-blue-900 transition-colors"
                                                    title="Edit user"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleToggleUserStatus(user._id)}
                                                    className={`p-2 rounded-md transition-colors ${user?.status
                                                        ? 'text-red-400 hover:text-red-300 hover:bg-red-900'
                                                        : 'text-green-400 hover:text-green-300 hover:bg-green-900'
                                                        }`}
                                                    title={user.status ? 'Block user' : 'Unblock user'}
                                                >
                                                    {user.status ? (
                                                        <ShieldOff className="h-4 w-4" />
                                                    ) : (
                                                        <Shield className="h-4 w-4" />
                                                    )}
                                                </button>

                                                <button
                                                    onClick={() => { handleDelete(user._id) }}
                                                    className="text-red-400 hover:text-red-300 p-2 rounded-md hover:bg-red-900 transition-colors"
                                                    title="Delete user"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        )}

                    </div>
                </div>

                {/* Pagination */}
                <div className="mt-4 rounded-2xl flex justify-between items-center px-6 py-4 bg-[#1e1e2f] border-t border-gray-700">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        className="space-x-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
                    >
                        Previous
                    </button>

                    <span className="text-gray-300 text-sm">
                        Page {currentPage} of {Math.ceil(totalPages / usersPerPage)}
                    </span>

                    <button
                        disabled={ Math.ceil(totalPages / usersPerPage) === 0 || currentPage === Math.ceil(totalPages / usersPerPage)}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        className="space-x-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>

            
            {/* Delete Modal sertup */}
            {isDeleteModalOpen && (
                <DeleteUserModal
                    onClose={() => setIsDeleteMdodal(prev => !prev)}
                    onConfirm={handleConfirmDelete}
                    userName={selectedUser?.username} />
            )}
            
            {/* Single Reusable User Modal */}
            <Modal
                isOpen={showUserModal}
                onClose={handleCloseModal} 
                title={isEditMode ? "Edit User" : "Add New User"} >
                <UserForm
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={handleSubmit}
                    onCancel={handleCloseModal}
                    isEdit={isEditMode}
                />
            </Modal>
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
};

export default AdminDashboard;