import React, { useState, useEffect } from 'react';
import { Bell, X, AlertCircle } from 'lucide-react';
import axiosInstance from '../../../../config/axiosInstance';
import Pagination from '../common/Pagination';

export default function NotificationPage() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInMs = now - date;
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
        if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        if (diffInDays === 1) return 'Yesterday';
        if (diffInDays < 7) return `${diffInDays} days ago`;
        return date.toLocaleDateString();
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/api/notifications');
            // axiosInstance already returns response.data via interceptor.
            // Normalize possible shapes: [] | { success, data } | { data: [...] }
            let notificationsData = [];
            if (Array.isArray(response)) {
                notificationsData = response;
            } else if (response && response.success && Array.isArray(response.data)) {
                notificationsData = response.data;
            } else if (response && Array.isArray(response.data)) {
                notificationsData = response.data;
            } else if (response && response.notifications && Array.isArray(response.notifications)) {
                // some APIs return { notifications: [...] }
                notificationsData = response.notifications;
            } else {
                // fallback: attempt to use response as single item or empty
                notificationsData = Array.isArray(response) ? response : [];
            }
            setNotifications(notificationsData);
            setError(null);
        } catch {
            setError('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    const removeNotification = async (id) => {
        try {
            await axiosInstance.delete(`/api/notifications/${id}`);
            setNotifications(notifications.filter(n => n.id !== id));
        } catch {
            // failed to remove notification - keep UI state as-is
        }
    };

    const markAsRead = async (id) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));

        try {
            await axiosInstance.post(`/api/notifications/${id}/read`);
        } catch {
            // failed to mark as read on server - revert optimistic update
            setNotifications(notifications.map(n =>
                n.id === id ? { ...n, read: false } : n
            ));
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;
    const [markingAll, setMarkingAll] = useState(false);
    const ITEMS_PER_PAGE = 5;
    const [currentPage, setCurrentPage] = useState(1);

    // Ensure currentPage is valid when notifications length changes
    useEffect(() => {
        const totalPages = Math.max(1, Math.ceil(notifications.length / ITEMS_PER_PAGE));
        if (currentPage > totalPages) setCurrentPage(totalPages);
    }, [notifications.length, currentPage]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading notifications...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={fetchNotifications}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-6 sm:py-10">

                <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                            Notifications
                        </h1>
                        {unreadCount > 0 && (
                            <span className="ml-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={fetchNotifications}
                            className="px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                            title="Refresh"
                        >
                            Refresh
                        </button>

                        <button
                            onClick={async () => {
                                // mark all as read
                                if (notifications.length === 0) return;
                                setMarkingAll(true);
                                const prev = notifications;
                                // optimistic update
                                setNotifications(prev.map(n => ({ ...n, read: true })));
                                try {
                                    // try bulk endpoint first
                                    await axiosInstance.post('/api/notifications/read-all');
                                } catch {
                                    // bulk endpoint failed, fall back to per-item calls
                                    try {
                                        await Promise.all(prev.map(n => axiosInstance.post(`/api/notifications/${n.id}/read`)));
                                    } catch {
                                        // failed marking all - rollback
                                        setNotifications(prev);
                                    }
                                } finally {
                                    setMarkingAll(false);
                                }
                            }}
                            disabled={markingAll || unreadCount === 0}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium ${markingAll || unreadCount === 0 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                        >
                            {markingAll ? 'Marking...' : 'Mark all as read'}
                        </button>
                    </div>
                </div>

                {notifications.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg font-medium">No notifications yet</p>
                        <p className="text-gray-400 text-sm mt-1">We'll let you know when something new comes up.</p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4 ">
                            {notifications.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((notif) => {
                                return (
                                    <div
                                        key={notif.id}
                                        className={`
                                        relative rounded-lg p-4 border-l-4 border-blue-400 transition-all duration-300 group
                                        ${notif.read
                                                ? 'bg-white shadow-sm opacity-80 hover:opacity-100'
                                                : 'bg-blue-50 shadow-sm hover:shadow-md'
                                            }
                                    `}
                                    >
                                        <div className="flex gap-4 items-start">
                                            <Bell className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 mt-0.5 text-blue-600" />

                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-blue-600 text-sm sm:text-base">
                                                    {notif.type.replace(/_/g, ' ')}
                                                </h3>
                                                <p className="text-gray-700 text-sm sm:text-base mt-1">
                                                    {notif.message}
                                                </p>
                                                <p className="text-gray-500 text-xs sm:text-sm mt-2">
                                                    {formatTimestamp(notif.createdAt)}
                                                </p>

                                                {!notif.read && (
                                                    <button
                                                        onClick={() => markAsRead(notif.id)}
                                                        className="mt-3 text-xs font-medium text-blue-600 hover:text-blue-700 transition"
                                                    >
                                                        Mark as read
                                                    </button>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => removeNotification(notif.id)}
                                                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition opacity-0 group-hover:opacity-100"
                                                aria-label="Remove notification"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        <Pagination
                            currentPage={currentPage}
                            totalItems={notifications.length}
                            itemsPerPage={ITEMS_PER_PAGE}
                            onPageChange={(p) => setCurrentPage(p)}
                        />
                    </>
                )}
            </div>
        </div>
    );
}