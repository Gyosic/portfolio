import { X } from "lucide-react";
import { FieldPath, FieldValues } from "react-hook-form";
import { FormItemWrapper } from "@/components/shared/form/FormItemWrapper";
import { TemplateFormItemProps } from "@/components/shared/form/TemplateFormItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TextField<T extends FieldValues, K extends FieldPath<T>>({
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
      <div className="relative w-full">
        <Input
          readOnly={fieldModel.readOnly}
          placeholder={fieldModel?.placeholder ?? `입력하세요.`}
          {...field}
          value={field?.value ?? ""}
          onBlur={() => {
            field.onBlur();
            // fieldModel?.onBlur?.({ getValues, setError, clearErrors });
          }}
        />
        {!!field.value && (
          <Button
            variant="ghost"
            type="button"
            className="absolute top-0 right-0 hover:bg-transparent hover:text-destructive"
            onClick={() => field.onChange()}
          >
            <X />
          </Button>
        )}
      </div>
    </FormItemWrapper>
  );
}
