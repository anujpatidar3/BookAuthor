import { Search } from 'lucide-react';

interface SearchBarProps {
  placeholder: string;
  onSearch: (term: string) => void;
  value?: string;
  onChange?: (term: string) => void;
  className?: string;
}

export function SearchBar({ 
  placeholder, 
  onSearch, 
  value, 
  onChange, 
  className = '' 
}: SearchBarProps) {
  const isControlled = value !== undefined && onChange !== undefined;

  const handleChange = (term: string) => {
    if (isControlled) {
      onChange(term);
    } else {
      onSearch(term);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={isControlled ? value : undefined}
        className="block w-full pl-10 pr-3 py-2 text-gray-700 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
}
