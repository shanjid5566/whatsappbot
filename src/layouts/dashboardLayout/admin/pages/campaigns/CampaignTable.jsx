import React, { useState } from "react";
import { UploadCloud, Trash2, Eye } from "lucide-react";
import Swal from "sweetalert2";
import { del } from "../../../../../service/apiService";
import CampaignDetailsModal from "./CampaignDetailsModal";

export default function CampaignTable({
  filtered,
  loading,
  uploadLoading,
  uploadCampaignId,
  handleUploadClick,
  formatDate,
  onDeleteSuccess, // optional callback from parent to refresh list after delete
}) {
  const [deleting, setDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log(filtered);
  const handleDeleteClick = async (campaignId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the campaign.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        setDeleting(true);
        setDeletingId(campaignId);
        await del(`/api/admin/campaigns/campaigns/${campaignId}`);

        await Swal.fire("Deleted!", "Campaign has been deleted.", "success");

        // notify parent to refresh list if callback provided
        if (typeof onDeleteSuccess === "function") onDeleteSuccess(campaignId);
      } catch (err) {
        const message =
          (err && err.message) ||
          (err && err.error) ||
          "Failed to delete campaign.";
        Swal.fire("Error", message, "error");
      } finally {
        setDeleting(false);
        setDeletingId(null);
      }
    }
  };

  const handleViewDetails = (campaign) => {
    setSelectedCampaign(campaign);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCampaign(null);
  };

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      {/*   Table View for Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {[
                "ID",
                "Name",
                "Created By",
                "Phone Count",
                "Created Date",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="px-6 py-4 text-left text-base font-semibold text-gray-700 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 bg-white">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-6 text-center text-gray-500">
                  Loading campaigns...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-6 text-center text-gray-500">
                  No campaigns found.
                </td>
              </tr>
            ) : (
              filtered.map((c, i) => (
                <tr
                  key={c.id}
                  className="hover:bg-gray-50 transition-all duration-200"
                >
                  <td className="px-6 py-3 text-sm text-gray-600">{i + 1}</td>
                  <td className="px-6 py-3 text-sm font-medium text-gray-900">
                    {c.name}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {c.createdBy?.fullName || "-"}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {c.phoneNumberCount ||
                      (c.phoneNumbers ? c.phoneNumbers.length : 0)}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">
                    {formatDate(c.createdAt)}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleUploadClick(c.id)}
                        disabled={uploadLoading && uploadCampaignId === c.id}
                        title={
                          uploadLoading && uploadCampaignId === c.id
                            ? "Uploading..."
                            : "Upload"
                        }
                        aria-label={
                          uploadLoading && uploadCampaignId === c.id
                            ? "Uploading numbers"
                            : "Upload numbers"
                        }
                        className={`flex items-center justify-center px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm transition ${
                          uploadLoading && uploadCampaignId === c.id
                            ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                            : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                        }`}
                      >
                        <UploadCloud className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteClick(c.id)}
                        disabled={deleting && deletingId === c.id}
                        title={
                          deleting && deletingId === c.id
                            ? "Deleting..."
                            : "Delete"
                        }
                        aria-label={
                          deleting && deletingId === c.id
                            ? "Deleting campaign"
                            : "Delete campaign"
                        }
                        className={`flex items-center justify-center px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm transition ${
                          deleting && deletingId === c.id
                            ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                            : "bg-red-50 text-red-600 hover:bg-red-100"
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => handleViewDetails(c)}
                        title="View Details"
                        aria-label="View campaign details"
                        className="flex items-center justify-center px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm transition bg-green-50 text-green-600 hover:bg-green-100"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/*  Card View for Mobile / Tablet */}
      <div className="md:hidden grid gap-4 p-4">
        {loading ? (
          <p className="text-center text-gray-500">Loading campaigns...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500">No campaigns found.</p>
        ) : (
          filtered.map((c, i) => (
            <div
              key={c.id}
              className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 hover:shadow-md transition-all duration-200"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-base font-semibold text-gray-900">
                  {c.name}
                </h3>
                <span className="text-xs text-gray-500">#{i + 1}</span>
              </div>

              <div className="space-y-1 text-sm text-gray-700">
                <p>
                  <span className="font-medium text-gray-600">Created By:</span>{" "}
                  {c.createdBy?.fullName || "-"}
                </p>
                <p>
                  <span className="font-medium text-gray-600">
                    Phone Count:
                  </span>{" "}
                  {c.phoneNumberCount ||
                    (c.phoneNumbers ? c.phoneNumbers.length : 0)}
                </p>
                <p>
                  <span className="font-medium text-gray-600">Date:</span>{" "}
                  {formatDate(c.createdAt)}
                </p>
              </div>

              <div className="mt-3 grid gap-2">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleUploadClick(c.id)}
                    disabled={uploadLoading && uploadCampaignId === c.id}
                    title={
                      uploadLoading && uploadCampaignId === c.id
                        ? "Uploading..."
                        : "Upload Numbers"
                    }
                    aria-label={
                      uploadLoading && uploadCampaignId === c.id
                        ? "Uploading numbers"
                        : "Upload numbers"
                    }
                    className={`flex-1 flex justify-center items-center px-3 py-2 rounded-lg text-sm font-medium shadow-sm transition ${
                      uploadLoading && uploadCampaignId === c.id
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                        : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                    }`}
                  >
                    <UploadCloud className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteClick(c.id)}
                    disabled={deleting && deletingId === c.id}
                    title={
                      deleting && deletingId === c.id ? "Deleting..." : "Delete"
                    }
                    aria-label={
                      deleting && deletingId === c.id
                        ? "Deleting campaign"
                        : "Delete campaign"
                    }
                    className={`flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium shadow-sm transition ${
                      deleting && deletingId === c.id
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                        : "bg-red-50 text-red-600 hover:bg-red-100"
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleViewDetails(c)}
                    title="View Details"
                    aria-label="View campaign details"
                    className="flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium shadow-sm transition bg-green-50 text-green-600 hover:bg-green-100"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Campaign Details Modal */}
      {isModalOpen && (
        <CampaignDetailsModal
          campaign={selectedCampaign}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
