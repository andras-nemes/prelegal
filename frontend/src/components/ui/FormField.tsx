interface FormFieldProps {
  label: string;
  hint?: string;
  children: React.ReactNode;
}

export function FormField({ label, hint, children }: FormFieldProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {hint && <p className="text-xs text-gray-500 mb-1">{hint}</p>}
      {children}
    </div>
  );
}
