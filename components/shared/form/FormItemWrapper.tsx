import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

interface FormItemWrapperProps {
  children: React.ReactNode;
  isForm: boolean;
  name: string;
  desc?: string;
  labelCls?: string;
  className?: string;
  formLabel?: React.ReactNode;
}

export function FormItemWrapper({
  children,
  name,
  desc,
  labelCls,
  isForm,
  className,
  formLabel,
}: FormItemWrapperProps) {
  if (!isForm) return <>{children}</>;

  return (
    <FormItem className={cn(className)}>
      {!!formLabel ? formLabel : <FormLabel className={cn(labelCls)}>{name}</FormLabel>}
      <FormControl>{children}</FormControl>
      {desc && <FormDescription className="text-gray-500 text-xs">{desc}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
}
