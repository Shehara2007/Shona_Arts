import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn('w-full rounded-md border border-red-100 bg-white px-4 py-3 text-gallery-ink outline-none transition placeholder:text-zinc-400 focus:border-gallery-red focus:ring-2 focus:ring-red-100 dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:focus:ring-white/10', className)}
    {...props}
  />
));

Input.displayName = 'Input';
