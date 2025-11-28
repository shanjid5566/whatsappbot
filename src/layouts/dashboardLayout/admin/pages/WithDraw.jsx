import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axiosInstance from "../../../../config/axiosInstance";
import NumberedPagination from "../../user/common/NumberedPagination";
import WithdrawTabs from "./withdrawComponents/WithdrawTabs";
import DesktopTable from "./withdrawComponents/DesktopTable";
import MobileList from "./withdrawComponents/MobileList";
import {
  formatDate,
  formatCurrency,
  getStatusBadgeClass,
} from "./withdrawComponents/helpers";

const WithDraw = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pages, setPages] = useState({ PENDING: 1, APPROVED: 1, REJECTED: 1 });
  const [pageSize] = useState(10);
  const [totals, setTotals] = useState({ PENDING: 0, APPROVED: 0, REJECTED: 0 });
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuDirection, setMenuDirection] = useState("down");
  const [processingIds, setProcessingIds] = useState({});
  const [activeTab, setActiveTab] = useState("PENDING");

  const tabs = [
    { id: "PENDING", label: "Pending", color: "yellow" },
    { id: "APPROVED", label: "Approved", color: "green" },
    { id: "REJECTED", label: "Rejected", color: "red" },
  ];

  const fetchWithdrawals = async (status, pageNumber = 1) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await axiosInstance.get(`/api/admin/withdrawals`, {
        params: { status, page: pageNumber, pageSize },
      });

  const data = resp?.data || {};
  setItems(Array.isArray(data.items) ? data.items : []);
  setTotals((s) => ({ ...s, [status]: data.total || 0 }));
  setPages((s) => ({ ...s, [status]: data.page || pageNumber }));
    } catch (err) {
      console.error("Error fetching withdrawals:", err);
      setError(err?.message || "Failed to load withdrawals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals(activeTab, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    const handleOutside = (e) => {
      if (
        e.target.closest(".action-menu") ||
        e.target.closest(".action-button")
      )
        return;
      setOpenMenuId(null);
    };
    document.addEventListener("pointerdown", handleOutside, { capture: true });
    return () =>
      document.removeEventListener("pointerdown", handleOutside, {
        capture: true,
      });
  }, []);

  const onPageChange = (p) => {
    setPages((s) => ({ ...s, [activeTab]: p }));
    fetchWithdrawals(activeTab, p);
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setPages((s) => ({ ...s, [tabId]: 1 }));
    setOpenMenuId(null);
  };



  const setProcessing = (id, value) => {
    setProcessingIds((s) => ({ ...s, [id]: value }));
  };

  const approveWithdrawal = async (id) => {
    try {
      setProcessing(id, true);
      await axiosInstance.post(`/api/admin/withdrawals/${id}/approve`);
      Swal.fire({
        icon: "success",
        title: "Approve successful",
        timer: 1800,
        showConfirmButton: false,
      });
      setOpenMenuId(null);
  fetchWithdrawals(activeTab, pages[activeTab] || 1);
    } catch (err) {
      console.error("Approve failed", err);
    } finally {
      setProcessing(id, false);
    }
  };

  const rejectWithdrawal = async (id) => {
    try {
      setProcessing(id, true);
      await axiosInstance.post(`/api/admin/withdrawals/${id}/reject`);
      Swal.fire({
        icon: "success",
        title: "Reject successful",
        timer: 1800,
        showConfirmButton: false,
      });
      setOpenMenuId(null);
  fetchWithdrawals(activeTab, pages[activeTab] || 1);
    } catch (err) {
      console.error("Reject failed", err);
      const msg = err?.message || err?.data?.message || "Reject failed";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: msg,
      });
    } finally {
      setProcessing(id, false);
    }
  };

  const confirmReject = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action will reject the withdrawal. This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reject",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      confirmButtonColor: "#d33",
    });

    if (result && result.isConfirmed) {
      await rejectWithdrawal(id);
    }
  };




  return (
    <div className="min-h-screen py-2 md:py-8 px-4 lg:px-11   relative z-0">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl lg:text-[40px] font-bold text-[#000000] mb-2">
          Withdraw Requests
        </h1>
        <p className="text-sm md:text-base text-[#727272]">
          Review and process withdrawals
        </p>
      </div>

      <main>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <WithdrawTabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />

          <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
            <div className="text-sm text-gray-600">Showing {activeTab.toLowerCase()} withdrawals</div>
          </div>

          <div className="overflow-x-auto">
            <DesktopTable
              items={items}
              loading={loading}
              activeTab={activeTab}
              processingIds={processingIds}
              openMenuId={openMenuId}
              menuDirection={menuDirection}
              onToggleMenu={(id) => setOpenMenuId(openMenuId === id ? null : id)}
              setMenuDirection={setMenuDirection}
              approveWithdrawal={approveWithdrawal}
              confirmReject={confirmReject}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
              getStatusBadgeClass={getStatusBadgeClass}
            />

            <MobileList
              items={items}
              loading={loading}
              activeTab={activeTab}
              processingIds={processingIds}
              approveWithdrawal={approveWithdrawal}
              confirmReject={confirmReject}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
              getStatusBadgeClass={getStatusBadgeClass}
            />
          </div>
        </div>

        {/* Pagination */}
        <NumberedPagination
          currentPage={pages[activeTab] || 1}
          totalItems={totals[activeTab] || 0}
          itemsPerPage={pageSize}
          onPageChange={onPageChange}
        />

        {error && <div className="text-red-500 mt-4">{String(error)}</div>}
      </main>
    </div>
  );
};

export default WithDraw;
