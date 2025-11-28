import React, { useState } from "react";
import Swal from "sweetalert2";
import { post } from "../../../../../service/apiService";

export default function CreateModal({
    isOpen,
    onClose,
    newName,
    setNewName,
    newMessage,
    setNewMessage,
    createError,
    createLoading,
    onCreate,
}) {
    // Local loading/error state for the create request made by this modal
    const [localLoading, setLocalLoading] = useState(false);
    const [localError, setLocalError] = useState(null);
    const [messagesPerScan, setMessagesPerScan] = useState(1);

    if (!isOpen) return null;

    const onCreateHandler = async () => {
        setLocalError(null);
        setLocalLoading(true);

        const payload = {
            name: newName,
            message: newMessage,
            messagesPerScan: Number(messagesPerScan) || 1,
        };

        try {
            await post("/api/admin/campaigns/campaigns", payload);
            await Swal.fire("Success", "Campaign created successfully.", "success");
            if (typeof onCreate === "function") onCreate();
            if (typeof onClose === "function") onClose();
        } catch (err) {
            const message = (err && err.message) || (err && err.error) || "Failed to create campaign.";
            setLocalError(message);
            Swal.fire("Error", message, "error");
        } finally {
            setLocalLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6 animate-fadeIn z-10">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Create Campaign</h2>

                <label className="block text-sm text-gray-700 mb-1">Name</label>
                <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Campaign name"
                    className="w-full mb-4 border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                />

                <label className="block text-sm text-gray-700 mb-1">Message</label>
                <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Campaign message"
                    rows={4}
                    className="w-full mb-4 border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                />

                {/* New numeric field: messagesPerScan */}
                <label className="block text-sm text-gray-700 mb-1">Messages Per Scan</label>
                <input
                    type="number"
                    min={1}
                    value={messagesPerScan}
                    onChange={(e) => setMessagesPerScan(e.target.value)}
                    className="w-full mb-4 border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                />

                {/* show either parent-provided error or local error */}
                {(createError || localError) && (
                    <p className="text-sm text-red-500 mb-3">{createError || localError}</p>
                )}

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-100"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onCreateHandler}
                        disabled={createLoading || localLoading}
                        className={`px-4 py-2 rounded-md bg-blue-600 text-white shadow-sm transition ${(createLoading || localLoading) ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-700"
                            }`}
                    >
                        {(createLoading || localLoading) ? "Creating..." : "Create"}
                    </button>
                </div>
            </div>
        </div>
    );
}
