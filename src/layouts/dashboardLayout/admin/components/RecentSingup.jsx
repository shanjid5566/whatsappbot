import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../../../config/axiosInstance";
import { useEffect, useState } from "react";
import { Search, GripVertical, Eye, UserPlus, XCircle } from "lucide-react";
import Swal from "sweetalert2";
// navigation to user profile page instead of modal

const formatDate = (value) => {
  if (!value) return "-";
  try {
    let d;
    if (typeof value === "number") {
      // seconds vs ms
      d = new Date(value < 1e12 ? value * 1000 : value);
    } else {
      d = new Date(value);
    }
    if (isNaN(d)) return "-";
    const pad = (n) => String(n).padStart(2, "0");
    const day = pad(d.getDate());
    const month = pad(d.getMonth() + 1);
    const year = String(d.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  } catch {
    return "-";
  }
};

const RecentSingup = () => {
  const [recentSignups, setRecentSignups] = useState([]);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [menuDirection, setMenuDirection] = useState("down");
  const navigate = useNavigate();
  // we display only the top N recent signups in this widget
  const VISIBLE_LIMIT = 5;
  const visibleSignups = recentSignups.slice(0, VISIBLE_LIMIT);

  const handleSuspend = async (userId) => {
    if (!userId) return;
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
      await axiosInstance.delete(`/api/auth/admin/users/${userId}`);
      setRecentSignups((prev) =>
        Array.isArray(prev) ? prev.filter((u) => u.id !== userId) : []
      );
      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "User deleted",
        timer: 1400,
        showConfirmButton: false,
      });
      setOpenMenuIndex(null);
    } catch (err) {
      console.error("Failed to delete user", err);
      Swal.fire({
        icon: "error",
        title: "Delete failed",
        text: err?.message || "Could not delete user",
      });
    }
  };

  useEffect(() => {
    const fetchRecentSignups = async () => {
      try {
        const response = await axiosInstance.get(`/api/auth/admin/users`);
        // backend may return data in response.data.users or response.users
        const users =
          response?.data?.users || response?.users || response?.data || [];
        setRecentSignups(Array.isArray(users) ? users : []);
      } catch (error) {
        console.error("Error fetching recent signups:", error);
      }
    };

    fetchRecentSignups();
  }, []);

  // Close any open action menu when clicking outside (use pointerdown + capture)
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

  return (
    <>
      <div className="bg-white rounded-xl overflow-hidden shadow">
        {/* Recent Signups */}
        <div>
          <div className="flex items-center justify-between px-6 py-2 md:py-6 border-b border-gray-200 bg-white">
            <h3 className="font-semibold text-black text-xl md:text-2xl">
              Recent Signups
            </h3>
            <Link
              to="/admin/user-management"
              className="text-sm text-[#515151] hover:text-blue-700"
            >
              View All
            </Link>
          </div>

          <div className="p-4">
            {/* show only top 5 here — compute visible slice once so direction logic is correct */}
            {/** visibleSignups used below to determine last-row behaviour correctly **/}
            {/** (some callers previously compared idx against recentSignups.length which is the full list) */}
            {/** compute visibleSignups here */}

            {/* Desktop table (md+) */}
            <div className="overflow-x-auto hidden md:block">
              <table className="w-full table-auto">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
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
                  {visibleSignups.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-4 text-sm text-gray-500">
                        No recent signups
                      </td>
                    </tr>
                  ) : (
                    visibleSignups.map((signup, idx) => (
                      <tr
                        key={signup.id || idx}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 md:px-6 py-3">
                          <div className="text-sm font-medium text-gray-800">
                            {signup.fullName ||
                              signup.name ||
                              signup.email ||
                              "—"}
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-3">
                          <div className="text-sm text-gray-600">
                            {signup.email || "-"}
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-3">
                          <div className="text-sm text-gray-600">
                            {signup.phoneNumber || signup.phone || "-"}
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-3">
                          <div className="text-sm text-gray-600">
                            {formatDate(
                              signup.joined ||
                                signup.createdAt ||
                                signup.joinDate ||
                                signup.date
                            )}
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-3">
                          <div className="text-sm text-gray-600">
                            {signup.referralBalanceCents ||
                              signup.referralBalance ||
                              signup.credits ||
                              "-"}
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-3 relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const key = signup.id ?? idx;
                              // open upward for the last two visible rows to avoid overflow
                              if (
                                idx >= Math.max(0, visibleSignups.length - 2)
                              ) {
                                setMenuDirection("up");
                              } else {
                                setMenuDirection("down");
                              }
                              setOpenMenuIndex(
                                openMenuIndex === key ? null : key
                              );
                            }}
                            className="text-gray-400 hover:text-gray-600 action-button"
                            aria-haspopup="true"
                            aria-expanded={openMenuIndex === (signup.id ?? idx)}
                          >
                            <GripVertical className="w-4 md:w-5 h-4 md:h-5" />
                          </button>

                          {openMenuIndex === (signup.id ?? idx) && (
                            <div
                              className={`absolute right-1 z-50 w-48 bg-white rounded-md shadow-lg action-menu ${
                                menuDirection === "down" ? "top-8" : "bottom-8"
                              }`}
                              onClick={(e) => e.stopPropagation()}
                              style={{ maxHeight: 220, overflow: "auto" }}
                            >
                              <ul className="py-2">
                                <li>
                                  <button
                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                                    onClick={() => {
                                      navigate(
                                        `/admin/user-management/${signup.id}`,
                                        { state: { user: signup } }
                                      );
                                      setOpenMenuIndex(null);
                                    }}
                                  >
                                    <Eye className="w-4 h-4" />
                                    View Profile
                                  </button>
                                </li>
                                <li>
                                  <button
                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-red-500"
                                    onClick={() => handleSuspend(signup.id)}
                                  >
                                    <XCircle className="w-4 h-4" />
                                    Suspend
                                  </button>
                                </li>
                              </ul>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {visibleSignups.map((signup, idx) => (
                <div
                  key={signup.id ?? idx}
                  className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm"
                >
                  <div className="flex flex-col items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-medium text-gray-800">
                        {signup.fullName || signup.name || signup.email || "—"}
                      </div>
                      <div className="text-base text-gray-700">
                        {signup.email || "-"}
                      </div>
                    </div>
                    <div className="text-sm text-gray-700">
                      #{signup.id ?? idx}
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-xs text-gray-600">Phone</div>
                      <div className="font-medium text-gray-800">
                        {signup.phoneNumber || signup.phone || "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Joined</div>
                      <div className="font-medium text-gray-800">
                        {formatDate(
                          signup.joined ||
                            signup.createdAt ||
                            signup.joinDate ||
                            signup.date
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div>
                      <div className="text-xs text-gray-500">Referral Balance</div>
                      <div className="font-medium text-gray-800">
                        {signup.referralBalanceCents ||
                          signup.referralBalance ||
                          signup.credits ||
                          "-"}
                      </div>
                    </div>

                    {/* Mobile: action buttons shown side-by-side */}
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() => {
                          navigate(`/admin/user-management/${signup.id}`, {
                            state: { user: signup },
                          });
                        }}
                        className="px-3 py-2 border rounded text-sm text-gray-700 hover:bg-gray-50"
                      >
                        View Profile
                      </button>

                      <button
                        onClick={() => handleSuspend(signup.id)}
                        className="px-3 py-2 rounded text-sm bg-red-50 text-red-600 hover:bg-red-100"
                      >
                        Suspend
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* profile modal removed; navigation to profile page is used instead */}
    </>
  );
};

export default RecentSingup;

// render modal outside to avoid nested return issues
// We'll add selectedUser modal rendering via a small HOC: export default already set; but modal needs to be rendered when selectedUser set.
