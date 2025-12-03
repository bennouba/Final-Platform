import * as React from "react";
import { cn } from "@/lib/utils";

export interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({ value, onValueChange, className, children, ...props }) => {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        const childProps = child.props as any;
        return React.cloneElement(child as any, {
          checked: childProps.value === value,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => onValueChange?.(e.target.value),
        });
      })}
    </div>
  );
};

export interface RadioGroupItemProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  label?: React.ReactNode;
}

export const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(({ className, label, ...props }, ref) => (
  <label className="flex items-center gap-2 cursor-pointer">
    <input
      ref={ref}
      type="radio"
      className={cn("h-4 w-4 text-blue-600 focus:ring-blue-500", className)}
      {...props}
    />
    {label && <span className="text-sm text-gray-700">{label}</span>}
  </label>
));
RadioGroupItem.displayName = "RadioGroupItem";
