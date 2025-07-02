interface DateFilterProps {
  label: string;
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  type?: 'date' | 'number';
  min?: string | number;
  max?: string | number;
  className?: string;
}

export function DateFilter({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  type = 'date',
  min,
  max,
  className = '' 
}: DateFilterProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value || ''}
        min={min}
        max={max}
        className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
