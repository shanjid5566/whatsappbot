import { BiMessageRoundedDetail, BiMoneyWithdraw } from "react-icons/bi";
import {
  FaWhatsapp,
  FaExclamationCircle,
  FaBolt,
  FaLock,
  FaPlus,
  FaPaperPlane,
} from "react-icons/fa";
import { FaSackDollar } from "react-icons/fa6";
import { MdOutlineMonetizationOn } from "react-icons/md";
import { useRef, useState, useEffect } from "react";
import { get, put, post } from "../../../../service/apiService";
import { useProfile } from "../../../../context/ProfileContext";
import StatusCard from "../components/StatusCard";
import ProfileBanner from "../components/ProfileBanner";
import BasicInfoCard from "../components/BasicInfoCard";
import BankInfoCard from "../components/BankInfoCard";
import ChangePasswordCard from "../components/ChangePasswordCard";
import WhatsappActiveCard from "../components/statusCards/WhatsappActiveCard";
import WhatsappDisconnectedCard from "../components/statusCards/WhatsappDisconnectedCard";
import TodaysBlastCard from "../components/statusCards/TodaysBlastCard";
import TodaysEarningsCard from "../components/statusCards/TodaysEarningsCard";

// API endpoints
const ENDPOINTS = {
  getProfile: "/api/profile/me",
  updateProfile: "/api/profile/basic",
  updateBankInfo: "/api/profile/bank",
  changePassword: "/api/auth/change-password"
};

export default function Profile() {
  const basicInfoRef = useRef(null);
  const bankInfoRef = useRef(null);
  const passwordRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [userData, setUserData] = useState(null);
  const [fetchingUser, setFetchingUser] = useState(true);

  // Track if any section has changes
  const [hasBasicInfoChanges, setHasBasicInfoChanges] = useState(false);
  const [hasBankInfoChanges, setHasBankInfoChanges] = useState(false);
  const [hasPasswordChanges, setHasPasswordChanges] = useState(false);

  // Check if any section has changes
  const hasAnyChanges = hasBasicInfoChanges || hasBankInfoChanges || hasPasswordChanges;

  // Use profile from ProfileContext and fetch bank info when profile is available
  const { profile: ctxProfile, loading: ctxLoading } = useProfile();

  useEffect(() => {
    const combineProfile = async () => {
      try {
        setFetchingUser(true);
        setError(null);

        if (!ctxProfile) {
          if (!ctxLoading) {
            setError("Please login to view your profile.");
          }
          setFetchingUser(false);
          return;
        }

        // Fetch bank information separately
        let bankResponse;
        try {
          bankResponse = await get(ENDPOINTS.updateBankInfo);
        } catch {
          bankResponse = null;
        }

        const userData = {
          ...ctxProfile,
          data: {
            ...((ctxProfile && ctxProfile.data) || ctxProfile),
            bankInfo: bankResponse?.data || null,
          },
        };

        setUserData(userData);
      } catch (err) {
        // error suppressed
        if (err?.status !== 401 && err?.statusCode !== 401) {
          setError("Failed to load user profile. Please refresh the page.");
        }
      } finally {
        setFetchingUser(false);
      }
    };

    combineProfile();
  }, [ctxProfile, ctxLoading]);

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const basicInfo = basicInfoRef.current?.getData();
      const bankInfo = bankInfoRef.current?.getData();
      const passwordData = passwordRef.current?.getData();

      // Validation: Check required fields
      const validationErrors = [];

      // Check Basic Info required fields
      if (!basicInfo.userName || basicInfo.userName.trim() === "") {
        validationErrors.push("Username is required");
      }


      // Check Bank Info required fields
      if (!bankInfo.bankName || bankInfo.bankName.trim() === "") {
        validationErrors.push("Bank name is required");
      }
      if (!bankInfo.accountNumber || bankInfo.accountNumber.trim() === "") {
        validationErrors.push("Account number is required");
      }
      if (!bankInfo.accountHolderName || bankInfo.accountHolderName.trim() === "") {
        validationErrors.push("Account holder name is required");
      }

      // If there are validation errors, show them and stop
      if (validationErrors.length > 0) {
        setError(validationErrors.join(", "));
        setLoading(false);
        return;
      }

      const apiCalls = [];

      // 1. Update Basic Information (only if changed)
      if (hasBasicInfoChanges) {
        apiCalls.push(
          put(ENDPOINTS.updateProfile, {
            fullName: basicInfo.userName,
            level: basicInfo.level,
            telegramId: basicInfo.telegramId,
            phoneNumber: basicInfo.phoneNumber
          }).then(response => {
            return { type: 'basicInfo', success: true, response };
          }).catch(error => {
            // suppressed
            return { type: 'basicInfo', success: false, error };
          })
        );
      } else {
        // Basic Info update skipped (no changes)
      }
      if (hasBankInfoChanges) {
        apiCalls.push(
          put(ENDPOINTS.updateBankInfo, bankInfo).then(response => {
            return { type: 'bankInfo', success: true, response };
          }).catch(error => {
            // suppressed
            let errorMsg = 'Unknown error';
            if (typeof error === 'string') {
              errorMsg = error;
            } else if (error?.message) {
              errorMsg = error.message;
            } else if (error?.data?.message) {
              errorMsg = error.data.message;
            } else if (error?.error) {
              errorMsg = error.error;
            }

            return { type: 'bankInfo', success: false, error: errorMsg };
          })
        );
      } else {
        // Bank Info update skipped (no changes)
      }


      if (passwordData.isPasswordChanged && hasPasswordChanges) {
        apiCalls.push(
          post(ENDPOINTS.changePassword, {
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
            confirmNewPassword: passwordData.confirmPassword
          }).then(response => {
            return { type: 'changePassword', success: true, response };
          }).catch(error => {
            // suppressed
            return { type: 'changePassword', success: false, error };
          })
        );
      } else {
        // Password change skipped (no changes made)
      }

      // If no changes, don't make any API calls
      if (apiCalls.length === 0) {
        setError("No changes detected. Please modify some fields before saving.");
        setLoading(false);
        return;
      }

      const results = await Promise.all(apiCalls);

      const failedCalls = results.filter(r => !r.success);

      if (failedCalls.length > 0) {
        // suppressed detailed failure logs

        // Create user-friendly error messages
        const errorMessages = failedCalls.map(f => {
          let errorDetail = typeof f.error === 'string' ? f.error : JSON.stringify(f.error, null, 2);

          // Handle specific error cases
          if (errorDetail.includes('Unique constraint failed on the fields: (`accountNumber`)')) {
            errorDetail = 'Account number already exists. Please use a different account number.';
          } else if (errorDetail.includes('Unique constraint')) {
            errorDetail = 'This information already exists in the system. Please check your input.';
          } else if (errorDetail.includes('Invalid')) {
            errorDetail = 'Invalid data provided. Please check all fields.';
          }

          return errorDetail;
        }).join(' | ');

        throw new Error(errorMessages);
      }

      const refreshedProfile = await get(ENDPOINTS.getProfile);

      // Fetch updated bank info
      let refreshedBank;
      try {
        refreshedBank = await get(ENDPOINTS.updateBankInfo);
      } catch {
        // suppressed
        refreshedBank = null;
      }

      // Combine refreshed data
      const refreshedData = {
        ...refreshedProfile,
        data: {
          ...refreshedProfile.data,
          bankInfo: refreshedBank?.data || null
        }
      };

      setUserData(refreshedData);

      // Reset all change flags
      setHasBasicInfoChanges(false);
      setHasBankInfoChanges(false);
      setHasPasswordChanges(false);

      // Clear password fields
      if (passwordRef.current?.clearFields) {
        passwordRef.current.clearFields();
      }

      setSuccess(true);

      // Show success message for 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);

    } catch (err) {
      // suppressed
      setError(err?.message || "Failed to update profile. Please try again.");

      // Clear error after 5 seconds
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 lg:py-8 py-4 px-4 lg:px-11">
      <div className="">
        {/* Header */}
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1 md:mb-2 text-[#000000]">
          Profile Data
        </h1>
        <p className="text-[#656565] mb-8 text-base md:text-lg lg:text-xl">
          Manage your profile information and banking data
        </p>

        {/* Loading State */}
        {fetchingUser ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <svg className="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-600 text-lg">Loading profile data...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mb-8">
              <WhatsappActiveCard />
              <WhatsappDisconnectedCard />
              <TodaysBlastCard />
              <TodaysEarningsCard />
            </div>

            {/* Top yellow banner */}
            <ProfileBanner
              title="Complete Your Profile"
              text="Complete your bank information to be able to make withdrawals and use all platform features."
            />

            {/* First Card: Basic Information */}
            <BasicInfoCard
              ref={basicInfoRef}
              userData={userData}
              onDataChange={(hasChanges) => setHasBasicInfoChanges(hasChanges)}
            />

            {/* Second Card: Bank Information */}
            <BankInfoCard
              ref={bankInfoRef}
              userData={userData}
              onDataChange={(hasChanges) => setHasBankInfoChanges(hasChanges)}
            />

            {/* Third Card: Change Password */}
            <ChangePasswordCard
              ref={passwordRef}
              onDataChange={(hasChanges) => setHasPasswordChanges(hasChanges)}
            />

            {/* Success Message */}
            {success && (
              <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
                <p className="font-semibold">✓ Profile updated successfully!</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                <p className="font-semibold">✗ Error: {error}</p>
              </div>
            )}

            <div className="flex justify-end mt-4">
              <button
                onClick={handleSaveChanges}
                disabled={loading || !hasAnyChanges}
                className={`w-full md:w-auto px-12 md:px-28 py-2 md:py-3 font-semibold rounded-md shadow-sm transition-colors ${loading || !hasAnyChanges
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  hasAnyChanges ? 'Save Changes' : 'No Changes'
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}