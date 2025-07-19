import React from 'react';

type DeleteModalProps = {
    onClose: () => void;
    onConfirm: () => void;
    userName?: string;
    title?: string;
}

const DeleteUserModal: React.FC<DeleteModalProps> = ({
    onClose,
    onConfirm,
    userName,
    title,
}) => {
    
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

                <div className="mb-6">
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                    </div>

                    <p className="text-gray-300 text-center mb-2">
                        Are you sure you want to delete <span className="font-semibold text-white">{userName}</span>?
                    </p>
                    <p className="text-sm text-gray-400 text-center">
                        This action cannot be undone. All data associated with this user will be permanently removed.
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="flex-1 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteUserModal