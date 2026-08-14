import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const fieldClasses =
  "w-full rounded-lg border border-ink/15 bg-white px-4 py-2.5 text-ink placeholder:text-ink-soft/50 focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/20";

export interface FieldWrapperProps {
  label?: string;
  error?: string;
  hint?: string;
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & FieldWrapperProps;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    return (
      <label className="flex flex-col gap-1.5 text-sm" htmlFor={id}>
        {label && <span className="font-medium text-ink">{label}</span>}
        <input ref={ref} id={id} className={cn(fieldClasses, className)} {...props} />
        {hint && !error && <span className="text-xs text-ink-soft">{hint}</span>}
        {error && <span className="text-xs text-red-700">{error}</span>}
      </label>
    );
  }
);
Input.displayName = "Input";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & FieldWrapperProps;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    return (
      <label className="flex flex-col gap-1.5 text-sm" htmlFor={id}>
        {label && <span className="font-medium text-ink">{label}</span>}
        <textarea ref={ref} id={id} className={cn(fieldClasses, "min-h-24", className)} {...props} />
        {hint && !error && <span className="text-xs text-ink-soft">{hint}</span>}
        {error && <span className="text-xs text-red-700">{error}</span>}
      </label>
    );
  }
);
Textarea.displayName = "Textarea";
