"use client";

// Page-local shadcn/ui Button pattern: Radix Slot + class-variance-authority.
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import s from "../career.module.css";

const buttonVariants = cva(`${s.button} cc:inline-flex cc:items-center cc:justify-center cc:gap-3`, {
  variants: { variant: { default: s.buttonDefault, outline: s.buttonOutline, icon: s.buttonIcon } },
  defaultVariants: { variant: "default" },
});
export function Button({ asChild = false, className, variant, ...props }: ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp data-slot="button" type={asChild ? undefined : "button"} className={buttonVariants({ variant, className })} {...props} />;
}
