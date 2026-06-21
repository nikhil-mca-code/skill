import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-neutral-950 text-white shadow-[0_10px_30px_rgba(15,23,42,0.16)] hover:-translate-y-0.5 hover:bg-neutral-900',
        outline: 'border border-neutral-200 bg-white text-neutral-900 shadow-sm hover:border-neutral-300 hover:bg-neutral-50',
        secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200',
        ghost: 'bg-transparent text-neutral-700 hover:bg-neutral-100',
        gradient:
          'bg-gradient-to-r from-neutral-950 via-neutral-800 to-neutral-900 text-white shadow-[0_18px_50px_rgba(15,23,42,0.24)] hover:-translate-y-0.5',
      },
      size: {
        default: 'h-11 px-5 py-2.5',
        sm: 'h-9 rounded-full px-4 text-xs',
        lg: 'h-12 rounded-full px-6',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
