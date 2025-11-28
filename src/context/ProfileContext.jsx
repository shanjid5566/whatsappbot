import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import Cookies from "js-cookie";
import { get } from "../service/apiService";

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProfile = useCallback(async () => {
        // Security check 1: Skip fetch on public routes
        const publicRoutes = ['/login', '/register', '/'];
        const currentPath = window.location.pathname;
        const isPublicRoute = publicRoutes.some(route =>
            currentPath === route || currentPath.startsWith(route + '/')
        );

        if (isPublicRoute && currentPath !== '/dashboard') {
            setLoading(false);
            setProfile(null);
            return null;
        }

        // Security check 2: Verify both localStorage and cookie token
        const storedUser = localStorage.getItem('rba_current_user');
        const accessToken = Cookies.get('accessToken');

        if (!storedUser || !accessToken) {
            // User not authenticated (no user data OR no valid token)
            // Skip fetch to avoid 401 redirect loop
            setLoading(false);
            setProfile(null);
            return null;
        }

        setLoading(true);
        setError(null);
        try {
            const resp = await get("/api/profile/me");
            const data = resp?.data || resp;
            setProfile(data);
            return data;
        } catch (err) {
            setError(err);
            setProfile(null);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return (
        <ProfileContext.Provider value={{ profile, setProfile, loading, error, refetch: fetchProfile }}>
            {children}
        </ProfileContext.Provider>
    );
}

export function useProfile() {
    const ctx = useContext(ProfileContext);
    if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
    return ctx;
}

export default ProfileContext;
