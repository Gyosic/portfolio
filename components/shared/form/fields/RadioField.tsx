import { useMemo } from "react";
import { FieldPath, FieldValues } from "react-hook-form";
import { FormItemWrapper } from "@/components/shared/form/FormItemWrapper";
import { TemplateFormItemProps } from "@/components/shared/form/TemplateFormItem";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function RadioField<T extends FieldValues, K extends FieldPath<T>>({
  fieldModel,
  field,
  isForm = true,
  labelCls,
}: TemplateFormItemProps<T, K>) {
  const enums = useMemo(() => {
    if (fieldModel?.enums) {
      return Object.entries(fieldModel.enums).map(([label, value]) => ({ label, value }));
    }

    return [];
  }, [fieldModel?.enums]);

  return (
    <FormItemWrapper
      name={fieldModel.name}
      desc={fieldModel.desc}
      isForm={isForm}
      className="space-y-3 py-4"
      labelCls={labelCls}
    >
      <RadioGroup
        onValueChange={field.onChange}
        defaultValue={fieldModel.default as string}
        className="flex space-x-1"
      >
        {enums.map(({ label, value }) => {
          return (
            <FormItem key={value as string} className="flex items-center space-x-3 space-y-0">
              <FormControl>
                <RadioGroupItem id={label} value={value as string} />
              </FormControl>
              <FormLabel htmlFor={label} className="font-normal">
                {label}
              </FormLabel>
            </FormItem>
          );
        })}
      </RadioGroup>
    </FormItemWrapper>
  );
}
