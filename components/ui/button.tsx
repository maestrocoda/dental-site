import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva("inline-flex items-center justify-center rounded-full font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9b49c] disabled:pointer-events-none disabled:opacity-50", { variants: { variant: { gold: "bg-[#d9b49c] text-[#171310] hover:bg-[#edcfb8]", light: "bg-white text-[#171310] hover:bg-[#f2ede7]" }, size: { default: "h-14 px-7 text-[15px]", nav: "h-12 px-6 text-sm" } }, defaultVariants: { variant: "gold", size: "default" } });
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> { asChild?: boolean }
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => { const Comp = asChild ? Slot : "button"; return <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />; });
Button.displayName = "Button";
