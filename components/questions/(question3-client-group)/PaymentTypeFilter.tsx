// components\questions\(question3-client-group)\PaymentTypeFilter.tsx

import { PaymentType } from "../shared-types";

interface PaymentTypeFilterProps {
  selectedPaymentType: PaymentType;
  onPaymentTypeChange: (paymentType: PaymentType) => void;
  paymentTypes: PaymentType[];
}

export default function PaymentTypeFilter({
  selectedPaymentType,
  onPaymentTypeChange,
  paymentTypes,
}: PaymentTypeFilterProps) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
        Filter by Payment Type
      </label>
      <div className="flex gap-2 flex-wrap">
        {paymentTypes.map((paymentType) => (
          <button
            key={paymentType}
            onClick={() => onPaymentTypeChange(paymentType)}
            className={`px-3 md:px-4 py-2 rounded-lg font-medium text-sm transition-all capitalize ${
              selectedPaymentType === paymentType
                ? "bg-emerald-600 dark:bg-emerald-500 text-white shadow-md hover:bg-emerald-700 dark:hover:bg-emerald-600"
                : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
            }`}
          >
            {paymentType}
          </button>
        ))}
      </div>
    </div>
  );
}
