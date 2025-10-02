export function InputField({
  id,
  label,
  icon,
  type,
  placeholder,
  value,
  onChange,
}: any) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        <input
          id={id}
          name={id}
          type={type}
          required
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
        />
      </div>
    </div>
  );
}
