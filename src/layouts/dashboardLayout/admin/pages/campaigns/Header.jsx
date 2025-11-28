import React from "react";
import { PlusCircle, Calendar, MessageSquare, Activity } from "lucide-react";

export default function Header({ onAddClick, onActiveClick, onRecentClick, onTodayClick }) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="w-full md:w-auto mb-4 md:mb-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Campaign Management</h1>
                <p className="text-gray-500 mt-1 text-sm">Manage your SMS campaigns and view campaign details</p>
            </div>

            <div className="flex flex-wrap items-center justify-start sm:justify-end gap-3 w-full sm:w-auto">
                <button
                    onClick={onTodayClick}
                    className="inline-flex items-center gap-2 bg-amber-600 text-white px-4 py-2 h-10 rounded-lg shadow-sm hover:bg-amber-700 transition text-sm min-w-[140px]"
                >
                    <Calendar className="w-4 h-4" />
                    <span className="truncate">{"Today's Campaign"}</span>
                </button>

                <button
                    onClick={onAddClick}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 h-10 rounded-lg shadow-sm hover:bg-blue-700 transition text-sm min-w-[140px]"
                >
                    <PlusCircle className="w-4 h-4" />
                    <span className="truncate">Add New Campaign</span>
                </button>

                <button
                    onClick={onActiveClick}
                    className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 h-10 rounded-lg shadow-sm hover:bg-emerald-700 transition text-sm min-w-[140px]"
                >
                    <Activity className="w-4 h-4" />
                    <span className="truncate">Active Campaign</span>
                </button>

                <button
                    onClick={onRecentClick}
                    className="inline-flex items-center gap-2 bg-violet-600 text-white px-4 py-2 h-10 rounded-lg shadow-sm hover:bg-violet-700 transition text-sm min-w-[140px]"
                >
                    <MessageSquare className="w-4 h-4" />
                    <span className="truncate">Recent Messages</span>
                </button>
            </div>
        </div>
    );
}
