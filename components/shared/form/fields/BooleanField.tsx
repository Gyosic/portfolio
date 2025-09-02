import { FieldPath, FieldValues } from "react-hook-form";
import { FormItemWrapper } from "@/components/shared/form/FormItemWrapper";
import { TemplateFormItemProps } from "@/components/shared/form/TemplateFormItem";
import { Switch } from "@/components/ui/switch";

export function BooleanField<T extends FieldValues, K extends FieldPath<T>>({
  fieldModel,
  field,
  isForm = true,
  labelPosition = "top",
  labelCls,
}: TemplateFormItemProps<T, K>) {
  return (
    <FormItemWrapper
      name={fieldModel.name}
      desc={fieldModel.desc}
      isForm={isForm}
      className={labelPosition === "left" ? "flex flex-1 items-center" : "flex-1"}
      labelCls={labelCls}
    >
      <div className="relative flex items-center">
        <Switch
          {...field}
          checked={field.value}
          onCheckedChange={field.onChange}
          id={fieldModel.name}
        />
      </div>
    </FormItemWrapper>
  );
}
