import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor: string;
  titleColor: string;
}

export function FeatureCard({ 
  href, 
  icon: Icon, 
  title, 
  description, 
  iconColor, 
  titleColor 
}: FeatureCardProps) {
  return (
    <Link
      href={href}
      className="group relative rounded-lg border border-gray-300 bg-white p-6 hover:shadow-lg transition-shadow"
    >
      <div>
        <span className={`rounded-lg inline-flex p-3 ${iconColor}`}>
          <Icon className="h-6 w-6" />
        </span>
      </div>
      <div className="mt-4">
        <h3 className={`text-lg font-medium text-gray-900 ${titleColor}`}>
          {title}
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          {description}
        </p>
      </div>
    </Link>
  );
}
