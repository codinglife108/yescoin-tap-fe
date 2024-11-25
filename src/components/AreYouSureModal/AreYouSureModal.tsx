import React from 'react';

const CloseButton = ({ onClick }: { onClick: () => void }) => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        onClick={onClick}
        className="cursor-pointer"
    >
        <circle cx="12" cy="12" r="11" stroke="white" strokeWidth="2"/>
        <path d="M8 8L16 16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <path d="M16 8L8 16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
);

export default function AreYouSureModal({ onClose, onConfirm, onCancel,message }: { onClose: () => void, onConfirm: () => void, onCancel: () => void, message: string }) {
    return (
        <div className="fixed z-10 inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-black rounded-lg p-3 pt-8 w-64 relative">
                <div className="absolute top-2 right-2">
                    <CloseButton onClick={onClose} />
                </div>
                <h2 className="text-white text-sm font-bold mb-6 text-left">
                    {message}
                </h2>
                <div className="flex justify-between">
                    <button
                        onClick={onConfirm}
                        className="bg-green-500 w-1/2 text-white text-sm px-6 py-2 rounded-md font-bold"
                    >
                        YES
                    </button>
                    &nbsp;
                    <button
                        onClick={onCancel}
                        className="bg-red-500 w-1/2 text-white text-sm px-6 py-2 rounded-md font-bold"
                    >
                        NO
                    </button>
                </div>
            </div>
        </div>
    );
}