export const MapLegend = () => (
  <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 z-[1000]">
    <h3 className="font-semibold text-gray-900 mb-2">Legend</h3>
    <div className="space-y-2 text-sm">
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
        <span>Active (Updated &lt; 10 min)</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
        <span>Inactive</span>
      </div>
    </div>
  </div>
);