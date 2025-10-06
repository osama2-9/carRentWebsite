interface StatsCardProps {
  title: string;
  value: number | undefined;
  isLoading?: boolean;
  dollerSign?: boolean;
}

export const StatsCard = ({
  title,
  value,
  isLoading,
  dollerSign,
}: StatsCardProps) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
    <div className="flex items-center justify-between mb-4">
      <div className={`flex items-center space-x-1 text-sm font-medium `}></div>
    </div>
    <div>
      {isLoading ? (
        <>
          <p className="animate-pulse font-semibold">Loading</p>
        </>
      ) : (
        <>
          {" "}
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {dollerSign ? "$" + value : value}
          </h3>{" "}
        </>
      )}

      <p className="text-gray-600 text-sm">{title}</p>
    </div>
  </div>
);
