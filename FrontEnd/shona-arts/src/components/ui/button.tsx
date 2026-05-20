import { type ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

const variants: Record<Variant, string> = {
  primary: 'bg-gallery-red text-white shadow-lg shadow-red-500/20 hover:bg-red-700',
  secondary: 'border border-red-200 bg-white text-gallery-red hover:bg-gallery-rose dark:border-white/10 dark:bg-zinc-900',
  ghost: 'text-gallery-ink hover:bg-gallery-rose dark:text-white dark:hover:bg-white/10',
  danger: 'bg-zinc-950 text-white hover:bg-black dark:bg-white dark:text-zinc-950',
};

export function Button({ className, variant = 'primary', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={cn('inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 font-bold transition focus:outline-none focus:ring-2 focus:ring-gallery-red focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60', variants[variant], className)}
      {...props}
    />
  );
}
