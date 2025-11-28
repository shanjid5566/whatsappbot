import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import IconWrapper from "./IconWrapper";
import InfoBox from "./InfoBox";
import FormField from "./FormField";
import { Lock } from "lucide-react";

const ChangePasswordCard = forwardRef(({ onDataChange }, ref) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Check for changes whenever password fields change
  useEffect(() => {
    const hasChanges = newPassword.length > 0 || currentPassword.length > 0 || confirmPassword.length > 0;
    if (onDataChange) {
      onDataChange(hasChanges);
    }
  }, [currentPassword, newPassword, confirmPassword, onDataChange]);

  useImperativeHandle(ref, () => ({
    getData: () => ({
      currentPassword,
      newPassword,
      confirmPassword,
      isPasswordChanged: newPassword.length > 0
    }),
    clearFields: () => {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  }));

  return (
    <div className="bg-[#FFFFFF] p-4 md:p-6 shadow-sm mt-4 md:mt-8 rounded-md">
      <div className="flex items-center gap-4 mb-4 md:mb-6">
        <IconWrapper
          icon={Lock}
          bgColor="bg-[#EE3557]"
          textColor="text-white"
        />
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-[#000000] mb-2">
            Change Password
          </h2>
          <p className="text-sm md:text-base text-[#000000]">
            Update your password to improve account security.
          </p>
        </div>
      </div>

      <div className="space-y-4 md:space-y-6">
        <InfoBox
          heading="Security Verification"
          text="Enter your current password and new password to update your account security. Leave the new password fields blank if you don't want to change it."
        />
        <div className="space-y-4 md:space-y-6">
          {/* Current Password Field - Full Width */}
          <FormField
            label="Current Password"
            type="password"
            placeholder="Enter your current password"
            note="Required to verify your identity when changing password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />

          {/* New Password Fields - Two Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <FormField
              label="New Password (Optional)"
              type="password"
              placeholder="Leave blank if you don't want to change"
              note="Leave blank if you don't want to change the password."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <FormField
              label="Confirm New Password (Optional)"
              type="password"
              placeholder="Repeat new password"
              note="Must be the same as the new password if filled in"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default ChangePasswordCard;
