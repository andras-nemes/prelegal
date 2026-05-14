interface SectionHeaderProps {
  title: string;
}

export function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <div className="mt-6 mb-3 border-b border-gray-200 pb-1">
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
        {title}
      </h3>
    </div>
  );
}
