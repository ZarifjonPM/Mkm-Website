interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormField({ label, error, required, children }: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function AdminInput({ error, className = "", ...props }: AdminInputProps) {
  return (
    <input
      {...props}
      className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 ${
        error ? "border-red-400" : "border-gray-300"
      } ${className}`}
    />
  );
}

interface AdminTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function AdminTextarea({ error, className = "", ...props }: AdminTextareaProps) {
  return (
    <textarea
      {...props}
      className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 resize-y min-h-[80px] ${
        error ? "border-red-400" : "border-gray-300"
      } ${className}`}
    />
  );
}

interface AdminSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export function AdminSelect({ error, className = "", children, ...props }: AdminSelectProps) {
  return (
    <select
      {...props}
      className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white ${
        error ? "border-red-400" : "border-gray-300"
      } ${className}`}
    >
      {children}
    </select>
  );
}
