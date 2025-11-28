import React, { useEffect, useState } from "react";
import { Search, GripVertical, Eye, UserPlus, XCircle } from "lucide-react";
import NumberedPagination from "../../user/common/NumberedPagination";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../../config/axiosInstance";
import Swal from "sweetalert2";

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [menuDirection, setMenuDirection] = useState("down");
  // selectedUser/modal removed — navigation to profile page is used instead
  const navigate = useNavigate();

  const formatDate = (rawDate) => {
    if (!rawDate) return "-";
    try {
      let d;
      if (typeof rawDate === "number") {
        d = new Date(rawDate * (rawDate < 1e12 ? 1000 : 1));
      } else {
        d = new Date(rawDate);
      }
      if (isNaN(d)) return "-";
      const pad = (n) => String(n).padStart(2, "0");
      const day = pad(d.getDate());
      const month = pad(d.getMonth() + 1);
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return "-";
    }
  };

  const fetchUsers = async (p = 1, ps = pageSize) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await axiosInstance.get(`/api/auth/admin/users`, {
        params: { page: p, pageSize: ps },
      });

      const data = resp?.data || resp || {};
      const list = Array.isArray(data.users)
        ? data.users
        : Array.isArray(data)
        ? data
        : [];
      setUsers(list);
      setTotal(data.total || 0);
      setPage(data.page || p);
      setPageSize(data.pageSize || ps);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  // Close any open action menu when clicking outside
  useEffect(() => {
    const handleOutside = (e) => {
      if (
        e.target.closest(".action-menu") ||
        e.target.closest(".action-button")
      )
        return;
      setOpenMenuIndex(null);
    };
    document.addEventListener("pointerdown", handleOutside, { capture: true });
    return () =>
      document.removeEventListener("pointerdown", handleOutside, {
        capture: true,
      });
  }, []);

  // client-side filter for the currently loaded page
  const filteredUsers = (() => {
    const q = searchQuery.trim().toLowerCase();
    return q
      ? users.filter(
          (u) =>
            (u.fullName || u.name || "").toLowerCase().includes(q) ||
            (u.email || "").toLowerCase().includes(q)
        )
      : users;
  })();

  const paginated = filteredUsers; // already a page from server

  const onPageChange = (p) => {
    setPage(p);
  };

  const handleSuspend = async (userId) => {
    if (!userId) return;
    const resp = await Swal.fire({
      title: "Confirm delete",
      text: "This will permanently delete the user. Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    });

    if (!resp.isConfirmed) return;

    try {
      await axiosInstance.delete(`/api/auth/admin/users/${userId}`);
      // remove from local list
      setUsers((prev) =>
        Array.isArray(prev) ? prev.filter((u) => u.id !== userId) : []
      );
      setTotal((t) => Math.max(0, (t || 1) - 1));
      setOpenMenuIndex(null);
      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "User deleted",
        timer: 1400,
        showConfirmButton: false,
      });
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
    <div className="min-h-screen py-2 md:py-8 px-4 lg:px-11 relative z-0 ">
      <main className=" pb-10">
        <div className="">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl lg:text-[40px] font-bold text-[#000000] mb-2">
              User Management
            </h1>
            <p className="text-sm md:text-base text-[#727272]">
              Manage customer accounts and view user details
            </p>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] hidden md:table">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 md:px-6 py-4 text-left text-sm md:text-base lg:text-lg font-semibold text-gray-700 whitespace-nowrap">
                      User Id
                    </th>
                    <th className="px-4 md:px-6 py-4 text-left text-sm md:text-base lg:text-lg font-semibold text-gray-700 whitespace-nowrap">
                      Name
                    </th>
                    <th className="px-4 md:px-6 py-4 text-left text-sm md:text-base lg:text-lg font-semibold text-gray-700 whitespace-nowrap">
                      Email
                    </th>
                    <th className="px-4 md:px-6 py-4 text-left text-sm md:text-base lg:text-lg font-semibold text-gray-700 whitespace-nowrap">
                      Phone
                    </th>
                    <th className="px-4 md:px-6 py-4 text-left text-sm md:text-base lg:text-lg font-semibold text-gray-700 whitespace-nowrap">
                      Join Date
                    </th>
                    <th className="px-4 md:px-6 py-4 text-left text-sm md:text-base lg:text-lg font-semibold text-gray-700 whitespace-nowrap">
                      Referral Balance
                    </th>
                    <th className="px-4 md:px-6 py-4 text-left text-sm md:text-base lg:text-lg font-semibold text-gray-700 whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-6 text-center text-gray-500"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : paginated.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-6 text-center text-gray-500"
                      >
                        No users
                      </td>
                    </tr>
                  ) : (
                    paginated.map((user, index) => {
                      const isLastTwoItems = index >= paginated.length - 2;
                      return (
                        <tr
                          key={user.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 md:px-6 py-4">
                            <span className="text-xs md:text-sm text-gray-700 whitespace-nowrap">
                              {user.id}
                            </span>
                          </td>
                          <td className="px-4 md:px-6 py-4">
                            <span className="text-xs md:text-sm text-gray-700 whitespace-nowrap">
                              {user.fullName || user.name}
                            </span>
                          </td>
                          <td className="px-4 md:px-6 py-4">
                            <span className="text-xs md:text-sm text-gray-700 whitespace-nowrap">
                              {user.email}
                            </span>
                          </td>
                          <td className="px-4 md:px-6 py-4">
                            <span className="text-xs md:text-sm text-gray-700 whitespace-nowrap">
                              {user.phoneNumber || "—"}
                            </span>
                          </td>
                          <td className="px-4 md:px-6 py-4">
                            <span className="text-xs md:text-sm text-gray-700 whitespace-nowrap">
                              {formatDate(
                                user.joinDate || user.createdAt || user.joined
                              )}
                            </span>
                          </td>
                          <td className="px-4 md:px-6 py-4">
                            <span className="text-xs md:text-sm text-gray-700 whitespace-nowrap">
                              {user.referralBalanceCents}
                            </span>
                          </td>
                          <td className="px-4 md:px-6 py-4 relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isLastTwoItems) setMenuDirection("up");
                                else setMenuDirection("down");
                                setOpenMenuIndex(
                                  openMenuIndex === user.id ? null : user.id
                                );
                              }}
                              className="text-gray-400 hover:text-gray-600 action-button"
                              aria-haspopup="true"
                              aria-expanded={openMenuIndex === user.id}
                            >
                              <GripVertical className="w-4 md:w-5 h-4 md:h-5" />
                            </button>

                            {openMenuIndex === user.id && (
                              <div
                                className={`absolute right-1 z-50 w-48 bg-white rounded-md shadow-lg action-menu ${
                                  menuDirection === "down"
                                    ? "top-8"
                                    : "bottom-8"
                                }`}
                                onClick={(e) => e.stopPropagation()}
                                style={{ maxHeight: 220, overflow: "auto" }}
                              >
                                <ul className="py-2">
                                  <li>
                                    <button
                                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                                      onClick={() => {
                                        // navigate to profile page, pass user in state to avoid refetch when possible
                                        navigate(
                                          `/admin/user-management/${user.id}`,
                                          { state: { user } }
                                        );
                                        setOpenMenuIndex(null);
                                      }}
                                    >
                                      <Eye className="w-4 h-4" /> View Profile
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-red-500"
                                      onClick={() => handleSuspend(user.id)}
                                    >
                                      <XCircle className="w-4 h-4" /> Suspend
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile cards - visible on small screens */}
            <div className="md:hidden p-4 space-y-3">
              {loading ? (
                <div className="text-center text-gray-500">Loading...</div>
              ) : paginated.length === 0 ? (
                <div className="text-center text-gray-500">No users</div>
              ) : (
                paginated.map((user, index) => {
                  return (
                    <div
                      key={user.id}
                      className="border border-gray-100 rounded-lg p-3 bg-white shadow-sm"
                    >
                      <div className="flex flex-col items-start justify-between gap-2">
                        <div>
                          <div className="text-sm font-medium text-gray-800">
                            {user.fullName || user.name || user.email || "—"}
                          </div>
                          <div className="text-base text-gray-700">
                            {user.email || "-"}
                          </div>
                        </div>
                        <div className="text-sM text-gray-500">
                          #{user.id ?? index}
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <div className="text-xs text-gray-500">Phone</div>
                          <div className="font-medium text-gray-800">
                            {user.phoneNumber || user.phone || "-"}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Joined</div>
                          <div className="font-medium text-gray-800">
                            {formatDate(
                              user.joined ||
                                user.createdAt ||
                                user.joinDate ||
                                user.date
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div>
                          <div className="text-xs text-gray-500">
                            Referral Balance
                          </div>
                          <div className="font-medium text-gray-800">
                            {user.referralBalanceCents ||
                              user.referralBalance ||
                              user.credits ||
                              "-"}
                          </div>
                        </div>

                        {/* Mobile: actions shown below referral balance */}
                        <div className="mt-3 flex items-center gap-2">
                          <button
                            onClick={() => {
                              navigate(`/admin/user-management/${user.id}`, {
                                state: { user },
                              });
                            }}
                            className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-md text-sm flex items-center gap-2 text-gray-800 shadow-sm"
                          >
                            <Eye className="w-4 h-4" /> View Profile
                          </button>

                          <button
                            onClick={() => handleSuspend(user.id)}
                            className="px-4 py-2 bg-red-50 border border-red-100 hover:bg-red-100 rounded-md text-sm flex items-center gap-2 text-red-600"
                          >
                            <XCircle className="w-4 h-4" /> Suspend
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination controls */}
            <div className="px-4 py-3">
              <NumberedPagination
                currentPage={page}
                totalItems={total}
                itemsPerPage={pageSize}
                onPageChange={onPageChange}
              />
            </div>

            {error && <div className="text-red-500 mt-4">{String(error)}</div>}

            {/* profile modal removed; navigating to profile page instead */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserManagement;
