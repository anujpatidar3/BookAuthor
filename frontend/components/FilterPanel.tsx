import { ReactNode } from 'react';

interface FilterPanelProps {
  isOpen: boolean;
  children: ReactNode;
  onClearAll: () => void;
  className?: string;
}

export function FilterPanel({ isOpen, children, onClearAll, className = '' }: FilterPanelProps) {
  if (!isOpen) return null;

  return (
    <div className={`bg-white p-4 rounded-lg border border-gray-200 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {children}
      </div>
      <div className="mt-4 flex justify-end">
        <button
          onClick={onClearAll}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}
