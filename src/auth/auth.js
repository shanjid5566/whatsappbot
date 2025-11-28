import ROLE from "./role";
import axios from "axios";
import Cookies from 'js-cookie';

const STORAGE_KEY = "rba_current_user";
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const API_BASE_URL = "https://louisalexbackend.mtscorporate.com/api";

export async function registerWithEmail(fullName, email, password, confirmPassword) {
  try {
    // Call backend API for registration
    const response = await axios.post(
      `${API_BASE_URL}/auth/register`,
      {
        fullName: fullName,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      },
      {
        withCredentials: true, // This allows cookies to be sent and received
      }
    );

    // Store accessToken and refreshToken in cookies (7 days expiry)
    if (response.data.accessToken) {
      Cookies.set(ACCESS_TOKEN_KEY, response.data.accessToken, { expires: 7 });
    }
    if (response.data.refreshToken) {
      Cookies.set(REFRESH_TOKEN_KEY, response.data.refreshToken, { expires: 7 });
    }

    // Backend will set the access token in cookies automatically
    // Store user data in localStorage
    const userData = {
      isAuthenticated: true,
      role: response.data.user?.role || ROLE.USER,
      email: response.data.user?.email || email,
      name: response.data.user?.fullName || fullName,
      user: response.data.user,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));

    return { success: true, user: userData, data: response.data };
  } catch (error) {
    // Handle error responses from backend
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Registration failed. Please try again.";
    return { success: false, message: errorMessage };
  }
}

export async function loginWithEmail(email, password) {
  try {
    // Call backend API for login
    const response = await axios.post(
      `${API_BASE_URL}/auth/login`,
      {
        email: email,
        password: password,
      },
      {
        withCredentials: true, // This allows cookies to be sent and received
      }
    );

    // Store accessToken and refreshToken in cookies (7 days expiry)
    if (response.data.accessToken) {
      Cookies.set(ACCESS_TOKEN_KEY, response.data.accessToken, { expires: 7 });
    }
    if (response.data.refreshToken) {
      Cookies.set(REFRESH_TOKEN_KEY, response.data.refreshToken, { expires: 7 });
    }

    // Backend will set the access token in cookies automatically
    // Store user data in localStorage
    const userData = {
      isAuthenticated: true,
      role: response.data.user?.role || ROLE.USER,
      email: response.data.user?.email || email,
      name: response.data.user?.fullName || "",
      user: response.data.user,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));

    return { success: true, user: userData, data: response.data };
  } catch (error) {
    // Handle error responses from backend
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Login failed. Please check your credentials.";
    return { success: false, message: errorMessage };
  }
}
export function logout() {
  localStorage.removeItem(STORAGE_KEY);
  Cookies.remove(ACCESS_TOKEN_KEY); // Remove access token from cookie
  Cookies.remove(REFRESH_TOKEN_KEY); // Remove refresh token from cookie
}

export function getToken() {
  // Get access token from cookie
  return Cookies.get(ACCESS_TOKEN_KEY) || null;
}

export function getRefreshToken() {
  // Get refresh token from cookie
  return Cookies.get(REFRESH_TOKEN_KEY) || null;
}

export function getCurrentUser() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { isAuthenticated: false, role: null, loading: false };
  }
  try {
    const parsed = JSON.parse(raw);
    return { ...parsed, loading: false };
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return { isAuthenticated: false, role: null, loading: false };
  }
}

export default {
  registerWithEmail,
  loginWithEmail,
  logout,
  getCurrentUser,
  getToken,
  getRefreshToken,
};

