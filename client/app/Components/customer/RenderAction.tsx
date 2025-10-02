import {
  CheckCircle,
  Clock,
  CreditCard,
  FileText,
  User,
  XCircle,
} from "lucide-react";
interface RenderActionSectionProps {
  nextRental: any;
  isContractSigned: boolean | undefined;
  handleOpenSignModal: () => void;
  contractUrl?: string;
  paymentStatus?: string | null;
  handlePayment: () => void;
  handleStartTrack: () => void;
}
export const RenderActionSection = ({
  nextRental,
  isContractSigned,
  handleOpenSignModal,
  contractUrl,
  paymentStatus,
  handlePayment,
  handleStartTrack,
}: RenderActionSectionProps) => {
  if (!nextRental) return null;

  if (!isContractSigned) {
    return (
      <div className="mt-8 pt-6 border-t border-white/20">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleOpenSignModal}
            className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-50 transition-colors flex items-center justify-center"
          >
            <FileText className="w-4 h-4 mr-2" />
            Email Contract to Sign
          </button>
          {contractUrl && (
            <a
              href={contractUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors flex items-center justify-center"
            >
              View Contract
            </a>
          )}
        </div>
      </div>
    );
  }

  if (isContractSigned) {
    const normalizedPaymentStatus = paymentStatus?.toLowerCase();

    if (!paymentStatus || paymentStatus === null) {
      return (
        <div className="mt-8 pt-6 border-t border-white/20">
          <button
            onClick={handlePayment}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-green-700 transition-colors flex items-center"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Proceed to Payment
          </button>
        </div>
      );
    }

    if (normalizedPaymentStatus === "pending") {
      return (
        <div className="mt-8 pt-6 border-t border-white/20">
          <div className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-yellow-200">
            <Clock className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="font-semibold text-yellow-800">Payment Pending</p>
              <p className="text-sm text-yellow-700">
                Your payment is being processed. Please wait for confirmation.
              </p>
            </div>
          </div>
          <button
            onClick={handlePayment}
            className="mt-4 cursor-pointer bg-white text-blue-500 px-6 py-3 rounded-lg font-semibold shadow transition-colors flex items-center"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Complete Payment
          </button>
        </div>
      );
    }

    if (normalizedPaymentStatus === "failed") {
      return (
        <div className="mt-8 pt-6 border-t border-white/20">
          <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg border border-red-200 mb-4">
            <XCircle className="w-5 h-5 text-red-600" />
            <div>
              <p className="font-semibold text-red-800">Payment Failed</p>
              <p className="text-sm text-red-700">
                There was an issue processing your payment. Please try again.
              </p>
            </div>
          </div>
          <button
            onClick={handlePayment}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-green-700 transition-colors flex items-center"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Retry Payment
          </button>
        </div>
      );
    }

    if (normalizedPaymentStatus === "success") {
      return (
        <div className="mt-8 pt-6 border-t border-white/20">
          <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg border border-green-200 mb-4">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-semibold text-green-800">
                Payment Successful!
              </p>
              <p className="text-sm text-green-700">
                Your rental has been confirmed and payment processed.
              </p>
            </div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-3">
              <User className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-blue-800 mb-1">
                  Ready to Pick Up Your Car!
                </p>
                <p className="text-sm text-blue-700">
                  You can now collect your vehicle at the scheduled time.
                  <strong>
                    {" "}
                    Please remember to bring your passport with you for
                    identification.
                  </strong>
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-center ">
            <button
              onClick={handleStartTrack}
              className="bg-white p-2 text-blue-500 font-semibold  rounded-md cursor-pointer"
            >
              Start Track
            </button>
          </div>
        </div>
      );
    }
  }

  return null;
};
