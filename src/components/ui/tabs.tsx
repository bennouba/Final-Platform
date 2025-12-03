import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsContextValue {
  value?: string | undefined;
  onValueChange?: ((v: string) => void) | undefined;
}
const TabsContext = React.createContext<TabsContextValue>({});

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ value, defaultValue, onValueChange, className, children, ...props }) => {
  const [internal, setInternal] = React.useState<string | undefined>(defaultValue);
  const current = value ?? internal;
  const setValue = (v: string) => {
    if (onValueChange) onValueChange(v);
    if (value === undefined) setInternal(v);
  };
  return (
    <TabsContext.Provider value={{ value: current, onValueChange: setValue }}>
      <div className={cn("w-full", className)} {...props}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("inline-flex items-center gap-2 p-1 bg-gray-100 rounded-lg", className)} {...props} />
);

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}
export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(({ className, value, ...props }, ref) => {
  const ctx = React.useContext(TabsContext);
  const active = ctx.value === value;
  return (
    <button
      ref={ref}
      className={cn(
        "px-3 py-1.5 rounded-md text-sm",
        active ? "bg-white shadow text-blue-700" : "text-gray-600 hover:bg-white/60",
        className
      )}
      onClick={(e) => {
        ctx.onValueChange?.(value);
        props.onClick?.(e);
      }}
      {...props}
    />
  );
});
TabsTrigger.displayName = "TabsTrigger";

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}
export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(({ className, value, ...props }, ref) => {
  const ctx = React.useContext(TabsContext);
  if (ctx.value !== value) return null;
  return <div ref={ref} className={cn("mt-4", className)} {...props} />;
});
TabsContent.displayName = "TabsContent";
