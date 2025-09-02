import { FieldPath, FieldValues } from "react-hook-form";
import { FormItemWrapper } from "@/components/shared/form/FormItemWrapper";
import { TemplateFormItemProps } from "@/components/shared/form/TemplateFormItem";
import { Textarea } from "@/components/ui/textarea";

export function TextareaField<T extends FieldValues, K extends FieldPath<T>>({
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
      <Textarea
        readOnly={fieldModel.readOnly}
        placeholder={fieldModel?.placeholder ?? `입력하세요.`}
        {...field}
        value={field?.value ?? ""}
      />
    </FormItemWrapper>
  );
}
