import React, { useEffect, useState, useRef } from "react";
import { get, post } from "../../../../service/apiService";
import axiosInstance from "../../../../config/axiosInstance";
import Header from "./campaigns/Header";
import SearchBar from "./campaigns/SearchBar";
import CampaignTable from "./campaigns/CampaignTable";
import CreateModal from "./campaigns/CreateModal";
import ActiveCampaignModal from "./campaigns/ActiveCampaignModal";
import RecentMessagesModal from "./campaigns/RecentMessagesModal";
import TodaysCampaignModal from "./campaigns/TodaysCampaignModal";
import NumberedPagination from "../../user/common/NumberedPagination";

const DUMMY_CAMPAIGNS = [
    {
        id: 4,
        name: "White 11 Sale",
        message: "White Friday 11 Special!",
        isActive: true,
        createdById: 52,
        createdAt: "2025-11-09T05:13:16.289Z",
        updatedAt: "2025-11-09T05:13:16.289Z",
        createdBy: {
            id: 52,
            fullName: "Admin User",
            email: "owner@gmail.com",
        },
        phoneNumbers: [
            "8801791840888",
            "8801854034758",
            "8801736130702",
            "8801883478528",
        ],
        phoneNumberCount: 4,
    },
];

export default function CampaignsPage() {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState("");
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isActiveOpen, setIsActiveOpen] = useState(false);
    const [isRecentOpen, setIsRecentOpen] = useState(false);
    const [isTodayOpen, setIsTodayOpen] = useState(false);
    const [activeCampaign, setActiveCampaign] = useState(null);
    const [activeLoading, setActiveLoading] = useState(false);
    const [activeError, setActiveError] = useState(null);
    const [newName, setNewName] = useState("");
    const [newMessage, setNewMessage] = useState("");
    const [createLoading, setCreateLoading] = useState(false);
    const [createError, setCreateError] = useState(null);
    const [uploadCampaignId, setUploadCampaignId] = useState(null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchCampaigns = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await get("/api/admin/campaigns/campaigns");
                const data = res && res.campaigns ? res.campaigns : [];
                setCampaigns(data);
            } catch {
                setError("Failed to fetch campaigns, showing sample data");
                // fallback to empty array so downstream code can safely use array methods
                setCampaigns([]);
            } finally {
                setLoading(false);
            }
        };
        fetchCampaigns();
    }, []);

    // Fetch active campaign once on mount to reduce modal load time
    useEffect(() => {
        const fetchActive = async () => {
            setActiveLoading(true);
            setActiveError(null);
            try {
                const res = await get("/api/admin/campaigns/active-campaign");
                const campaign = res?.campaign || res;
                setActiveCampaign(campaign || null);
            } catch (err) {
                setActiveError((err && err.message) || (err && err.error) || "Failed to load active campaign.");
                setActiveCampaign(null);
            } finally {
                setActiveLoading(false);
            }
        };

        fetchActive();
    }, []);

    // search/filter campaigns safely (campaigns could be non-array in some error paths)
    const searched = Array.isArray(campaigns)
        ? campaigns.filter(
              (c) =>
                  (c.name || "").toString().toLowerCase().includes(query.toLowerCase()) ||
                  (c.createdBy?.fullName || "").toString().toLowerCase().includes(query.toLowerCase())
          )
        : [];

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalItems = searched.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    // Ensure current page is valid when filters change
    useEffect(() => {
        // reset to first page on new query
        setCurrentPage(1);
    }, [query]);

    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(totalPages);
    }, [totalPages, currentPage]);

    const paginated = searched.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const formatDate = (iso) => {
        try {
            return new Date(iso).toLocaleDateString("en-GB");
        } catch {
            return iso;
        }
    };

    // Create Campaign
    const handleCreateCampaign = async () => {
        const payload = { name: newName.trim(), message: newMessage.trim() };
        if (!payload.name || !payload.message) {
            setCreateError("Both name and message are required.");
            return;
        }

        setCreateLoading(true);
        setCreateError(null);

        try {
            const res = await post("/api/admin/campaigns/campaigns", payload);
            const created = res?.campaign || res?.data || res;

            if (created && (created.id || created.name)) {
                setCampaigns((prev) => [created, ...prev]);
            }

            setNewName("");
            setNewMessage("");
            setIsModalOpen(false);
        } catch (err) {
            setCreateError(err?.message || "Failed to create campaign");
        } finally {
            setCreateLoading(false);
        }
    };

    // Upload Excel File
    const handleUploadClick = (campaignId) => {
        setUploadMessage(null);
        setUploadCampaignId(campaignId);
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files && e.target.files[0];
        const id = uploadCampaignId;
        if (!file || !id) return;

        setUploadLoading(true);
        setUploadMessage(null);

        try {
            const fd = new FormData();
            fd.append("excelFile", file);
            await axiosInstance.post(
                `/api/admin/campaigns/campaigns/${id}/upload-excel`,
                fd,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            setUploadMessage(" Upload successful");
        } catch (err) {
            setUploadMessage(" Upload failed: " + (err?.message || "Unknown error"));
        } finally {
            setUploadLoading(false);
            setUploadCampaignId(null);
            if (fileInputRef.current) fileInputRef.current.value = null;
        }
    };

    return (
        <div className="min-h-screen py-10 px-6 md:px-12 bg-[#F9FAFB]">
            <Header
                onAddClick={() => setIsModalOpen(true)}
                onActiveClick={() => setIsActiveOpen(true)}
                onRecentClick={() => setIsRecentOpen(true)}
                todayName={activeCampaign?.name}
                onTodayClick={() => setIsTodayOpen(true)}
            />
            <SearchBar query={query} setQuery={setQuery} />

            {error && (
                <div className="p-3 rounded-md mb-4 text-sm font-medium bg-red-50 text-red-700">
                    {error}
                </div>
            )}

            {uploadMessage && (
                <div
                    className={`p-3 rounded-md mb-4 text-sm font-medium ${uploadMessage.includes("✅") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                        }`}
                >
                    {uploadMessage}
                </div>
            )}

            <input ref={fileInputRef} type="file" accept=".xls,.xlsx" style={{ display: "none" }} onChange={handleFileChange} />

            <CampaignTable
                filtered={paginated}
                loading={loading}
                uploadLoading={uploadLoading}
                uploadCampaignId={uploadCampaignId}
                handleUploadClick={handleUploadClick}
                formatDate={formatDate}
                onDeleteSuccess={(deletedId) => setCampaigns((prev) => prev.filter((c) => c.id !== deletedId))}
            />

            <NumberedPagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={(p) => setCurrentPage(p)}
            />

            <CreateModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                newName={newName}
                setNewName={setNewName}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                createError={createError}
                createLoading={createLoading}
                onCreate={handleCreateCampaign}
            />

            <ActiveCampaignModal
                isOpen={isActiveOpen}
                onClose={() => setIsActiveOpen(false)}
                campaign={activeCampaign}
                loading={activeLoading}
                error={activeError}
            />
            <RecentMessagesModal isOpen={isRecentOpen} onClose={() => setIsRecentOpen(false)} />
            <TodaysCampaignModal isOpen={isTodayOpen} onClose={() => setIsTodayOpen(false)} />
        </div>
    );
}
