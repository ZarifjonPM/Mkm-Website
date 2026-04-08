interface AdminTopbarProps {
  title: string;
  actions?: React.ReactNode;
}

export function AdminTopbar({ title, actions }: AdminTopbarProps) {
  return (
    <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 shadow-sm">
      <h1 className="text-lg font-semibold text-slate-800 tracking-tight">{title}</h1>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
