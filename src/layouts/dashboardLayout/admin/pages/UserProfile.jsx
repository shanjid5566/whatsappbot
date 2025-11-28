import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../../../config/axiosInstance";
import Swal from "sweetalert2";
import { ArrowLeft, Copy } from "lucide-react";
import { BiLeftArrow } from "react-icons/bi";

const UserProfile = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(location?.state?.user || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) return; // use navigation state when available
    const fetchUser = async () => {
      setLoading(true);
      try {
        const resp = await axiosInstance.get(`/api/auth/admin/users/${id}`);
        const data = resp?.data || resp || {};
        setUser(data.user || data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setError(err?.message || "Failed to load user");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchUser();
  }, [id, user]);

  const formatDate = (val) => {
    if (!val) return "-";
    try {
      const d = new Date(val);
      if (isNaN(d)) return "-";
      const pad = (n) => String(n).padStart(2, "0");
      return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
    } catch {
      return "-";
    }
  };

  // Show raw stored numeric value (no currency conversion to USD).
  // The user requested not to convert amounts to dollars — we display
  // whatever the backend returns (with thousand separators).
  const formatNumberRaw = (val) => {
    if (val == null || val === "") return "-";
    const num = Number(val);
    if (Number.isNaN(num)) return "-";
    // format with grouping, keep up to 2 fractional digits if present
    return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(
      num
    );
  };

  const copyToClipboard = async (text) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(String(text));
      // small visual feedback could be added; for now use console
      // (avoid adding SweetAlert here to keep component light)
      console.info("Copied to clipboard:", text);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const startEdit = () => {
    setNameInput(user?.fullName || user?.name || "");
    setEditMode(true);
  };

  const cancelEdit = () => {
    setEditMode(false);
    setNameInput("");
  };

  const saveName = async () => {
    if (!nameInput || !id) return;
    try {
      setSaving(true);
      const resp = await axiosInstance.patch(`/api/auth/admin/users/${id}`, {
        fullName: nameInput,
      });
      const data = resp?.data || resp || {};
      const updated = data.user || data;
      // merge updated fields into state
      setUser((prev) => ({ ...(prev || {}), ...(updated || {}) }));
      setEditMode(false);
      Swal.fire({
        icon: "success",
        title: "Saved",
        text: "Name updated successfully",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Failed to update name", err);
      Swal.fire({
        icon: "error",
        title: "Update failed",
        text: err?.message || "Could not update name",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSuspend = async () => {
    if (!id) return;
    const res = await Swal.fire({
      title: "Confirm delete",
      text: "This will permanently delete the user. Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    });

    if (!res.isConfirmed) return;

    try {
      await axiosInstance.delete(`/api/auth/admin/users/${id}`);
      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "User has been deleted.",
        timer: 1500,
        showConfirmButton: false,
      });
      // navigate back to previous page (users list)
      navigate(-1);
    } catch (err) {
      console.error("Failed to delete user", err);
      Swal.fire({
        icon: "error",
        title: "Delete failed",
        text: err?.message || "Could not delete user",
      });
    }
  };

  return (
    <div className="min-h-screen py-6 px-4 md:px-8 lg:px-12 bg-gray-50">
      <div className="mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <button
              className="inline-flex items-center px-3 py-1.5 rounded-md text-sm text-gray-600 hover:text-gray-800"
              onClick={() => navigate(-1)}
              aria-label="Go back"
            >
              <ArrowLeft  className="w-5 h-5 mr-1" />
             
            </button>

            <h1 className="text-xlmd:text-3xl lg:text-[40px] font-semibold text-gray-900">
              User Profile
            </h1>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6 md:grid md:grid-cols-1 md:gap-6">
            {/* Left / Main */}
            <div>
              {loading ? (
                <div className="text-gray-500">Loading...</div>
              ) : error ? (
                <div className="text-red-500">{String(error)}</div>
              ) : !user ? (
                <div className="text-gray-500">No user data</div>
              ) : (
                <div className="flex flex-col sm:space-x-6">
                  <div className="shrink-0 md:mx-auto flex flex-col items-center text-center">
                    <div className="h-20 w-20 md:w-26 md:h-26 rounded-full bg-indigo-600 flex items-center justify-center text-white text-3xl font-semibold">
                      {((user.fullName || user.name || "?") + "").charAt(0).toUpperCase()}
                    </div>
                    <div className="mt-2">
                      <h2 className="text-lg md:text-xl font-bold text-gray-900">
                        {user.fullName || user.name || "-"}
                      </h2>
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-0 flex-1">
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="rounded-md p-3 bg-gray-50">
                        <div className="text-sm text-gray-600">Email</div>
                        <div className="flex items-center justify-between mt-1">
                          <div className="text-base text-gray-800 wrap-break-word">
                            {user.email || "-"}
                          </div>
                          <button
                            onClick={() => copyToClipboard(user.email)}
                            className="ml-3  text-gray-400 hover:text-gray-700"
                            title="Copy email"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="rounded-md p-3 bg-gray-50">
                        <div className="text-xs text-gray-500">Phone</div>
                        <div className="flex items-center justify-between mt-1">
                          <div className="text-sm text-gray-800">
                            {user.phoneNumber || user.phone || "-"}
                          </div>
                          <button
                            onClick={() =>
                              copyToClipboard(user.phoneNumber || user.phone)
                            }
                            className="ml-3 text-gray-400 hover:text-gray-700 text-2xl"
                            title="Copy phone"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="rounded-md p-3 bg-white border">
                        <div className="text-xs text-gray-500">Joined</div>
                        <div className="mt-1 font-medium text-gray-800">
                          {formatDate(
                            user.joinDate || user.createdAt || user.joined
                          )}
                        </div>
                      </div>

                      <div className="rounded-md p-3 bg-white border">
                        <div className="text-xs text-gray-500">
                          Referral Balance
                        </div>
                        <div className="mt-1 font-medium text-gray-800">
                          {formatNumberRaw(
                            user.referralBalanceCents ?? user.referralBalance
                          )}
                        </div>
                      </div>

                      <div className="rounded-md p-3 bg-white border">
                        <div className="text-xs text-gray-500">Status</div>
                        <div className="mt-1 font-medium text-gray-800">
                          {user.isActive === false ? "Disabled" : "Active"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right / Actions */}
            <div className="mt-6 md:w-1/3 ">
              {/* Buttons: stacked on very small screens, side-by-side on sm+ */}
              <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
                {!editMode ? (
                  <>
                    <button
                      onClick={startEdit}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Edit name
                    </button>

                    <button
                      onClick={handleSuspend}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-200 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50"
                    >
                      Suspend
                    </button>
                  </>
                ) : (
                  <div className="w-full">
                    <div className="space-y-2">
                      <input
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md text-sm"
                        placeholder="Full name"
                      />
                      <div className="flex items-center gap-4">
                        <button
                          onClick={saveName}
                          disabled={saving}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 disabled:opacity-60"
                        >
                          {saving ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="inline-flex items-center justify-center px-3 py-2 border border-gray-200 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
