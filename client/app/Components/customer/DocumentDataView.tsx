import { CheckCircle } from "lucide-react";
interface DocumentDataViewProps {
  data: any;
  title: string;
  icon: any;
}
const DocumentDataView = ({
  data,
  title,
  icon: Icon,
}: DocumentDataViewProps) => (
  
  <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Icon className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        <div className="px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-600">
          <CheckCircle className="w-4 h-4 inline mr-1" />
          Verified
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Document ID
            </p>
            <p className="text-sm font-medium text-gray-800">{data.id}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Full Name
            </p>
            <p className="text-sm font-medium text-gray-800">{data.name}</p>
          </div>
        </div>

        {data.nationality && (
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Nationality
            </p>
            <p className="text-sm font-medium text-gray-800">
              {data.nationality}
            </p>
          </div>
        )}

        {data.class && (
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              License Class
            </p>
            <p className="text-sm font-medium text-gray-800">{data.class}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Issue Date
            </p>
            <p className="text-sm font-medium text-gray-800">
              {data.issueDate}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Expiry Date
            </p>
            <p className="text-sm font-medium text-gray-800">
              {data.expiryDate}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
export default DocumentDataView;
