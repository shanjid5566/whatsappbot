import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../config/axiosInstance";
import { useNavigate } from "react-router-dom";
import NumberedPagination from "../../user/common/NumberedPagination";

const ReferralNew = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const resp = await axiosInstance.get(
          "/api/auth/admin/referrals/summary"
        );
        const payload = resp?.data || resp || {};
        if (!mounted) return;
        setData(payload);
      } catch (err) {
        console.error("Failed to load referral summary", err);
        if (!mounted) return;
        setError(err?.message || "Failed to load referral summary");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchSummary();
    return () => {
      mounted = false;
    };
  }, []);

  // reset page when data changes
  useEffect(() => {
    setPage(1);
  }, [data]);

  const formatNumberRaw = (val) => {
    if (val == null || val === "") return "-";
    const num = Number(val);
    if (Number.isNaN(num)) return "-";
    return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(
      num
    );
  };

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

  const totalTop = Array.isArray(data?.topEarners) ? data.topEarners.length : 0;

  return (
    <div className="min-h-screen py-2 md:py-8 px-4 lg:px-11 bg-gray-50 overflow-x-hidden">
      <div className="mx-auto">
        <div className="flex flex-col  justify-between mb-6">
          <h1 className="text-2xl md:text-3xl lg:text-[40px] font-semibold text-gray-900 mb-2">
            Referral Summary
          </h1>
          <p className="text-sm md:text-base text-[#727272]">
            Overview of referral statistics and top earners.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {loading ? (
            <div className="text-gray-600">Loading...</div>
          ) : error ? (
            <div className="text-red-500">{String(error)}</div>
          ) : !data ? (
            <div className="text-gray-600">No data</div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-3 py-4">
                <div className="p-4 bg-white rounded border border-gray-200 h-24 flex flex-col justify-center">
                  <div className="text-xs text-gray-500">Role</div>
                  <div className="mt-1 font-medium text-gray-800">
                    {data.role || "-"}
                  </div>
                </div>

                <div className="p-4 bg-white rounded border border-gray-200 h-24 flex flex-col justify-center">
                  <div className="text-xs text-gray-500">Total Users</div>
                  <div className="mt-1 font-medium text-gray-800">
                    {data.totalUsers ?? "-"}
                  </div>
                </div>

                <div className="p-4 bg-white rounded border border-gray-200 h-24 flex flex-col justify-center">
                  <div className="text-xs text-gray-500">
                    Total Referral Balance (raw)
                  </div>
                  <div className="mt-1 font-medium text-gray-800">
                    {formatNumberRaw(data.totalReferralBalanceCents)}
                  </div>
                </div>
              </div>

              {/* Top earners: table on md+, cards on mobile */}
              <div>
                <h2 className="text-lg md:text-xl lg:text-2xl font-medium text-gray-900 mb-1 px-3">
                  Top Earners
                </h2>

                {/* Desktop table */}
                <div className="hidden md:block overflow-x-auto w-full">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm md:text-base font-medium text-gray-700 uppercase">
                          Name
                        </th>
                        <th className="px-4 py-2 text-left text-sm md:text-base font-medium  text-gray-700 uppercase">
                          Email
                        </th>
                        <th className="px-4 py-2 text-left text-sm md:text-base font-medium text-gray-700 uppercase">
                          Referral Balance
                        </th>
                        <th className="px-4 py-2 text-left text-sm md:text-base font-medium text-gray-700 uppercase">
                          Joined
                        </th>
                        <th className="px-4 py-2 text-left text-sm md:text-base font-medium text-gray-700 uppercase">
                          Profile
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {Array.isArray(data.topEarners) &&
                      data.topEarners.length ? (
                        (() => {
                          const start = (page - 1) * 10;
                          const pageItems = data.topEarners.slice(
                            start,
                            start + 10
                          );
                          return pageItems.map((u) => (
                            <tr key={u.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-800 min-w-0">
                                {u.fullName || u.name || "-"}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600 min-w-0">
                                {u.email || "-"}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-800 text-left">
                                {formatNumberRaw(
                                  u.referralBalanceCents ?? u.referralBalance
                                )}
                              </td>

                              <td className="px-4 py-3 text-sm text-gray-600">
                                {formatDate(u.createdAt || u.joined)}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/admin/user-management/${u.id}`, {
                                      state: { user: u },
                                    });
                                  }}
                                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100"
                                >
                                  View Profile
                                </button>
                              </td>
                            </tr>
                          ));
                        })()
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-4 py-3 text-sm text-gray-600"
                          >
                            No top earners
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="md:hidden space-y-3 px-3 py-4">
                  {Array.isArray(data.topEarners) && data.topEarners.length ? (
                    (() => {
                      const start = (page - 1) * 10;
                      const pageItems = data.topEarners.slice(
                        start,
                        start + 10
                      );
                      return pageItems.map((u) => (
                        // Make the mobile card non-clickable; only the "View Profile" button will navigate
                        <div
                          key={u.id}
                          className="w-full text-left p-3 bg-white border rounded shadow-sm hover:shadow-md transition px-3 py-4"
                        >
                          <div className="flex items-start gap-3 ">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-col  justify-between gap-2">
                                <div className="font-medium text-gray-900 wrap-break-word">
                                  Name : {u.fullName || u.name || "-"}
                                </div>
                                <div className="text-sm text-gray-900 text-left">
                                  Referral Balance :{" "}
                                  {formatNumberRaw(
                                    u.referralBalanceCents ?? u.referralBalance
                                  )}
                                </div>
                              </div>
                              <div className="mt-1 flex flex-col  justify-between">
                                <div className="wrap-break-word text-base text-gray-800">
                                  Email : {u.email || "-"}
                                </div>
                                <div className="text-base text-gray-800">
                                  Joined : {formatDate(u.createdAt || u.joined)}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* View Profile button: only this navigates to the profile. Left-aligned and restyled for better visual */}
                          <div className="mt-3 flex justify-start">
                            <button
                              type="button"
                              aria-label={`View profile of ${
                                u.fullName || u.name || u.email || u.id
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/admin/user-management/${u.id}`, {
                                  state: { user: u },
                                });
                              }}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold text-white bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                            >
                              <span>View Profile</span>
                            </button>
                          </div>
                        </div>
                      ));
                    })()
                  ) : (
                    <div className="text-sm text-gray-600">No top earners</div>
                  )}
                </div>

                {/* Footer: showing X to Y of Z + pagination */}
                <div className="mt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                  <div className="ml-auto">
                    <NumberedPagination
                      currentPage={page}
                      totalItems={totalTop}
                      itemsPerPage={10}
                      onPageChange={(p) => setPage(p)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReferralNew;
