import { FieldPath, FieldValues } from "react-hook-form";
import { FormItemWrapper } from "@/components/shared/form/FormItemWrapper";
import { TemplateFormItemProps } from "@/components/shared/form/TemplateFormItem";
import { InputRange } from "@/components/shared/InputRange";
import { Input } from "@/components/ui/input";

export function DateField<T extends FieldValues, K extends FieldPath<T>>({
  fieldModel,
  field,
  isForm = true,
  labelPosition = "top",
  labelCls,
}: TemplateFormItemProps<T, K>) {
  if (!!fieldModel.range)
    return (
      <FormItemWrapper
        name={fieldModel.name}
        desc={fieldModel.desc}
        isForm={isForm}
        className={labelPosition === "left" ? "flex flex-1 items-center" : "flex-1"}
        labelCls={labelCls}
      >
        <InputRange type={fieldModel.type} {...field} value={field?.value} />
      </FormItemWrapper>
    );

  return (
    <FormItemWrapper
      name={fieldModel.name}
      desc={fieldModel.desc}
      isForm={isForm}
      className={labelPosition === "left" ? "flex flex-1 items-center" : "flex-1"}
      labelCls={labelCls}
    >
      <Input type={fieldModel.type} {...field} value={field?.value ?? ""} />
    </FormItemWrapper>
  );
}
