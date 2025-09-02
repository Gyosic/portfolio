"use client";
import { useMemo } from "react";
import { FieldPath, FieldValues } from "react-hook-form";
import Combobox, { Item } from "@/components/shared/Combobox";
import { FormItemWrapper } from "@/components/shared/form/FormItemWrapper";
import { TemplateFormItemProps } from "@/components/shared/form/TemplateFormItem";

export function ComboboxField<T extends FieldValues, K extends FieldPath<T>>({
  fieldModel,
  field,
  isForm = true,
  labelPosition = "top",
  labelCls,
}: TemplateFormItemProps<T, K>) {
  const enums = useMemo(() => {
    if (fieldModel?.enums) {
      if (fieldModel.type === "hex-enum")
        return Object.entries(fieldModel.enums).map(([label, value]) => ({
          label,
          value: String(value),
        }));

      return Object.entries(fieldModel.enums).map(([label, value]) => ({ label, value }));
    }

    return [];
  }, [fieldModel?.enums]);

  return (
    <FormItemWrapper
      name={fieldModel.name}
      desc={fieldModel.desc}
      isForm={isForm}
      className={labelPosition === "left" ? "flex flex-1 items-center" : "flex-1"}
      labelCls={labelCls}
    >
      <Combobox
        {...field}
        multiple={fieldModel.multiple}
        placeholder={fieldModel.placeholder || "입력하세요"}
        readOnly={fieldModel.readOnly}
        enableInput={fieldModel.enableInput}
        items={enums as Item[]}
        className="flex-1"
        contentCls="left-0"
        onValueChange={(v) => field.onChange(v)}
      />
    </FormItemWrapper>
  );
}
