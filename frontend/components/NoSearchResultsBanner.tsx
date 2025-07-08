interface NoSearchResultsBannerProps {
  searchTerm: string;
}

export function NoSearchResultsBanner({
  searchTerm,
}: NoSearchResultsBannerProps) {
  return (
    <div className="text-center py-12">
      <p className="text-gray-500">
        No results found for &quot;{searchTerm}&quot;
      </p>
      <p className="text-sm text-gray-400 mt-2">
        Try adjusting your search terms or browse all books and authors.
      </p>
    </div>
  );
}
