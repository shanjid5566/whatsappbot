import { ChevronDown, CreditCard } from "lucide-react";
import { useState, forwardRef, useImperativeHandle, useEffect } from "react";

import IconWrapper from "./IconWrapper";
import InfoBox from "./InfoBox";
import FormField from "./FormField";

const BankInfoCard = forwardRef(({ userData, onDataChange }, ref) => {
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");

  // Bank options
  const bankOptions = [
    "BCA",
    "BRI",
    "BNI",
    "BANK JAGO",
    "SEABANK",
    "DANA",
    "OVO",
    "GOPAY",
    "LINK AJA"
  ];

  // Track original values to detect changes
  const [originalValues, setOriginalValues] = useState({});

  // Update state when userData changes
  useEffect(() => {
    if (userData) {
      const data = userData.data || userData;
      const bankData = data.bankInfo || data;

      // Bank Name from bank data
      const displayBankName = bankData.bankName || "";
      setBankName(displayBankName);

      // Account Number from bank data
      const accNum = bankData.accountNumber || "";
      setAccountNumber(accNum);

      // Account Holder Name from bank data
      const accHolder = bankData.accountHolderName || "";
      setAccountHolderName(accHolder);

      // Store original values
      setOriginalValues({
        bankName: displayBankName,
        accountNumber: accNum,
        accountHolderName: accHolder,
      });

      // development logs suppressed
    }
  }, [userData]);

  // Check for changes whenever values change
  useEffect(() => {
    if (Object.keys(originalValues).length > 0) {
      const hasChanges =
        bankName !== originalValues.bankName ||
        accountNumber !== originalValues.accountNumber ||
        accountHolderName !== originalValues.accountHolderName;

      if (onDataChange) {
        onDataChange(hasChanges);
      }
    }
  }, [
    bankName,
    accountNumber,
    accountHolderName,
    originalValues,
    onDataChange,
  ]);

  useImperativeHandle(ref, () => ({
    getData: () => {
      return {
        bankName: bankName,
        accountNumber,
        accountHolderName,
        branch: "Uttara",
        routingNumber: "095123456",
      };
    },
  }));

  return (
    <div className="bg-[#FFFFFF] p-4 md:p-6  shadow-sm mt-4 md:mt-8 rounded-md">
      <div className="flex items-center  gap-4 mb-4 md:mb-6">
        <IconWrapper
          icon={CreditCard}
          bgColor="bg-[#0BA876]"
          textColor="text-white"
        />
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-[#000000] mb-2">
            Bank Information
          </h2>
          <p className="text-sm md:text-base text-[#000000]">
            Bank account information for transactions and withdrawals
          </p>
        </div>
      </div>

      <div className="space-y-4 md:space-y-6">
        <InfoBox
          heading="Important Information"
          text="All fields marked with * are required. Complete all bank information to be able to make withdrawals and use payment features."
        />

        <InfoBox
          heading="Penarikan Minimum - E-Wallet"
          text="Penarikan minimum E-Wallet adalah Rp20.000"
        />

        <InfoBox
          heading="Penarikan Minimum - Bank"
          text="Penarikan minimum Bank adalah Rp50.000"
        />

        <div>
          <label className="block text-sm md:text-base font-medium text-[#000000] mb-1">
            Bank Name *
          </label>
          <div className="relative">
            <select
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-md bg-white text-[#000000] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none pr-10"
            >
              <option value="">Select your bank</option>
              {bankOptions.map((bank) => (
                <option key={bank} value={bank}>
                  {bank}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              size={20}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <FormField
            label="Account Number *"
            placeholder="Enter account number"
            note="Enter account number without spaces or hyphens"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
          />
          <FormField
            label="Account Holder Name *"
            placeholder="Name as per bank account"
            note="The name must be exactly the same as the one on the account"
            value={accountHolderName}
            onChange={(e) => setAccountHolderName(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
});

export default BankInfoCard;
