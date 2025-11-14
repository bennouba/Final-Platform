import * as React from "react";
import { cn } from "@/lib/utils";

interface Item { value: string; label: React.ReactNode }

interface SelectContextValue {
  items: Item[];
  register: (item: Item) => void;
  value?: string;
  onValueChange?: (v: string) => void;
  placeholder?: string;
}
const SelectContext = React.createContext<SelectContextValue | null>(null);

export interface SelectProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export const Select: React.FC<SelectProps> = ({ value, defaultValue, onValueChange, className, children, ...props }) => {
  const [internal, setInternal] = React.useState<string | undefined>(defaultValue);
  const [items, setItems] = React.useState<Item[]>([]);
  const current = value ?? internal;
  const register = React.useCallback((item: Item) => {
    setItems((prev) => (prev.find((i) => i.value === item.value) ? prev : [...prev, item]));
  }, []);
  const setValue = (v: string) => {
    if (onValueChange) onValueChange(v);
    if (value === undefined) setInternal(v);
  };
  return (
    <SelectContext.Provider value={{ items, register, ...(current !== undefined && { value: current }), onValueChange: setValue }}>
      <div className={cn("w-full", className)} {...props}>{children}</div>
    </SelectContext.Provider>
  );
};

export type SelectTriggerProps = React.SelectHTMLAttributes<HTMLSelectElement>;
export const SelectTrigger = React.forwardRef<HTMLSelectElement, SelectTriggerProps>(({ className, children, ...props }, ref) => {
  const ctx = React.useContext(SelectContext)!;
  return (
    <select
      ref={ref}
      className={cn("h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500", className)}
      value={ctx.value ?? ""}
      onChange={(e) => ctx.onValueChange?.(e.target.value)}
      {...props}
    >
      <option value="" disabled hidden>{/* placeholder handled by SelectValue visually */}</option>
      {ctx.items.map((item) => (
        <option key={item.value} value={item.value}>
          {typeof item.label === 'string' ? item.label : undefined}
        </option>
      ))}
    </select>
  );
});
SelectTrigger.displayName = "SelectTrigger";

export const SelectValue: React.FC<{ placeholder?: string }> = ({ placeholder }) => {
  // Visual placeholder only; native select shows first option when empty
  return <span className="sr-only">{placeholder}</span>;
};

export const SelectContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children }) => {
  return <div data-select-content className="hidden">{children}</div>;
};

export type SelectItemProps = React.LiHTMLAttributes<HTMLLIElement> & { value: string };
export const SelectItem: React.FC<SelectItemProps> = ({ value, children }) => {
  const ctx = React.useContext(SelectContext)!;
  React.useEffect(() => {
    ctx.register({ value, label: children });
  }, [ctx, value, children]);
  return null;
};
