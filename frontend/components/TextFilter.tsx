interface TextFilterProps {
  label: string;
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  className?: string;
}

export function TextFilter({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  className = '' 
}: TextFilterProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        value={value || ''}
        className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
