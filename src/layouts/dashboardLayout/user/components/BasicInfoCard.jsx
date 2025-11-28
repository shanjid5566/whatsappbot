import { User } from "lucide-react";
import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import IconWrapper from "./IconWrapper";
import FormField from "./FormField";

const BasicInfoCard = forwardRef(({ userData, onDataChange }, ref) => {
  const [userName, setUserName] = useState("");
  const [level, setLevel] = useState("");
  const [joinDate, setJoinDate] = useState("");
  const [telegramId, setTelegramId] = useState("");

  // Track original values to detect changes
  const [originalValues, setOriginalValues] = useState({});

  // Update state when userData changes
  useEffect(() => {
    if (userData) {

      // Handle nested data structure from API response
      // API returns: { success: true, data: { id, fullName, email, ... } }
      const data = userData.data || userData;

      // Username: Show fullName (editable)
      const displayName = data.fullName || "";
      setUserName(displayName);

      // Level: BRONZE, SILVER, GOLD, etc.
      setLevel(data.level || "BRONZE");

      // Format join date from ISO string to readable format
      const joinDateStr = data.joinDate || data.createdAt;
      if (joinDateStr) {
        const date = new Date(joinDateStr);
        // Format: "28 Oct 2025"
        setJoinDate(date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }));
      }

      // Telegram ID: show empty if null
      setTelegramId(data.telegramId || "");

      // Store original values
      setOriginalValues({
        userName: displayName,
        level: data.level || "BRONZE",
        telegramId: data.telegramId || ""
      });

      // development logs suppressed
    }
  }, [userData]);

  // Check for changes whenever values change
  useEffect(() => {
    if (Object.keys(originalValues).length > 0) {
      const hasChanges =
        userName !== originalValues.userName ||
        telegramId !== originalValues.telegramId;

      if (onDataChange) {
        onDataChange(hasChanges);
      }
    }
  }, [userName, telegramId, originalValues, onDataChange]);

  useImperativeHandle(ref, () => ({
    getData: () => ({
      userName,
      level,
      joinDate,
      telegramId
    })
  }));

  return (
    <div className="bg-[#FFFFFF] p-4 md:p-6 shadow-sm mt-4 md:mt-8 rounded-md">
      <div className="flex items-center gap-4 mb-4 md:mb-6">
        <IconWrapper
          icon={User}
          bgColor="bg-[#2C6EEF]"
          textColor="text-white"
        />
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-[#000000] mb-2">
            Basic Information
          </h2>
          <p className="text-sm md:text-base text-[#000000]">
            Basic information about your account
          </p>
        </div>
      </div>
      <div className="space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <FormField
            label="User Name *"
            placeholder="Enter your username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            readonly={false}
          />

          <FormField
            label="Level"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            readonly={true}
          />
          <FormField
            label="Join Date"
            value={joinDate}
            onChange={(e) => setJoinDate(e.target.value)}
            readonly={true}
          />
          <FormField
            label="Telegram ID"
            placeholder="your telegram id"
            value={telegramId}
            onChange={(e) => setTelegramId(e.target.value)}
            readonly={false}
          />
        </div>
        {/* <div className="flex justify-end">
          <button className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            Save Changes
          </button>
        </div> */}
      </div>
    </div>
  );
});

export default BasicInfoCard;
