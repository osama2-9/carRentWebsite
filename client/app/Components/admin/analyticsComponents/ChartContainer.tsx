import { LoadingSpinner } from "@/app/pages/admin/analytics/page";

export const ChartContainer = ({
  title,
  children,
  isLoading,
}: {
  title: string;
  children: React.ReactNode;
  isLoading: boolean;
}) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
    <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
    {isLoading ? <LoadingSpinner /> : children}
  </div>
);
