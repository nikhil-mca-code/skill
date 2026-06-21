import { cn } from '@/lib/utils';

export function MarketingCard({
  className,
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn('rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl', className)}>
      {children}
    </div>
  );
}
