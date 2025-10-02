import { RefreshCw } from "lucide-react";

interface DeleteModalProps {
    modalTitle: string;
    modalMessage: string;
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean;
}
export const DeleteModal = ({ modalTitle, modalMessage, onClose, onConfirm , isLoading }: DeleteModalProps) => {
    return (
        <div className="fixed z-50 w-full inset-0 flex items-center justify-center bg-black/50">
            <div className="bg-white p-6 rounded-lg shadow-sm max-w-4xl"  >

                <div className="flex flex-col space-y-4">

                    <h2 className="text-lg font-bold">{modalTitle}</h2>
                    <p className="mb-6 font-semibold">{modalMessage}</p>
                </div>
                <div className="flex items-center justify-end space-x-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 text-white rounded-lg hover:bg-gray-400 flex items-center justify-center">Cancel</button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center">{isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : "Delete"}</button>
                </div>
            </div>
        </div>
    )
}