import { AlertCircle, Clock, FileText, Upload } from "lucide-react";
interface DocumentUploadViewProps {
  type: string;
  title: string;
  icon: any;
  uploadedFile: File | null;
  setUploadedFiles: (
    updater: (prev: Record<string, File | null>) => Record<string, File | null>
  ) => void;
  handleFileUpload?: () => void;
}
const DocumentUploadView = ({
  type,
  title,
  icon: Icon,
  uploadedFile,
  setUploadedFiles,
}: DocumentUploadViewProps) => {
  const handleFileUpload = (docType: any, event: any) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFiles((prev) => ({
        ...prev,
        [docType]: file,
      }));
    }
  };
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Icon className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              uploadedFile
                ? "bg-blue-50 text-blue-600"
                : "bg-gray-50 text-gray-600"
            }`}
          >
            {uploadedFile ? (
              <Clock className="w-4 h-4 inline mr-1" />
            ) : (
              <AlertCircle className="w-4 h-4 inline mr-1" />
            )}
            {uploadedFile ? "Under review" : "Upload required"}
          </div>
        </div>

        {uploadedFile ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <FileText className="w-5 h-5 text-gray-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">
                  {uploadedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Document Under Review
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    We will check your document and notify you once verification
                    is complete.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-gray-400" />
                <p className="mb-1 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG or PDF (MAX. 10MB)
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept=".png,.jpg,.jpeg,.pdf"
                onChange={(e) => handleFileUpload(type, e)}
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentUploadView;
