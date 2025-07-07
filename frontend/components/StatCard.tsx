interface StatCardProps {
  emoji: string;
  title: string;
  description: string;
  color: string;
}

export function StatCard({ emoji, title, description, color }: StatCardProps) {
  return (
    <div className="text-center">
      <div className={`text-3xl font-bold ${color}`}>{emoji}</div>
      <div className="mt-2 text-lg font-medium text-gray-900">{title}</div>
      <div className="text-sm text-gray-500">
        {description}
      </div>
    </div>
  );
}
