interface DateInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  min?: string;
  max?: string;
  className?: string;
}

export function DateInput({
  label,
  name,
  value,
  onChange,
  required = false,
  error,
  disabled = false,
  min,
  max,
  className = ''
}: DateInputProps) {
  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label} {required && '*'}
      </label>
      <input
        type="date"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        min={min}
        max={max}
        className={`mt-1 block w-full rounded-md border-gray-300 text-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
          error ? 'border-red-300' : ''
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
