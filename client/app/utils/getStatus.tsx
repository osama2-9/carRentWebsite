import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { CarLocation } from "../types/CarLocation";
export const isCarActive = (car: CarLocation): boolean => {
  const lastUpdate = new Date(car.timestamp).getTime();
  const now = Date.now();
  const tenMinutes = 10 * 60 * 1000;
  return now - lastUpdate < tenMinutes;
}
export const getsStatus = () => {
  const getStatusIcon = (status: any) => {
    const icons: any = {
      ACTIVE: <Activity className="w-4 h-4" />,
      COMPLETED: <CheckCircle className="w-4 h-4" />,
      CONFIRMED: <CheckCircle className="w-4 h-4" />,
      PENDING: <Clock className="w-4 h-4" />,
      CANCELLED: <XCircle className="w-4 h-4" />,
    };
    return icons[status] || <AlertTriangle className="w-4 h-4" />;
  };

  const getStatusColor = (status: any) => {
    const colors: any = {
      ACTIVE: "bg-green-100 text-green-800 border-green-200",
      COMPLETED: "bg-blue-100 text-blue-800 border-blue-200",
      CONFIRMED: "bg-indigo-100 text-indigo-800 border-indigo-200",
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      CANCELLED: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getContractStatus = (status: any) => {
    switch (status) {
      case false:
        return "bg-yellow-100 text-yellow-800";
      case true:
        return "bg-blue-100 text-blue-800";

      default:
        return "bg-gray-100 text-gray-800";
    }
  };



  return { getStatusIcon, getStatusColor, getContractStatus, isCarActive };
};
