"use client";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { FieldPath, FieldValues } from "react-hook-form";
import { FormItemWrapper } from "@/components/shared/form/FormItemWrapper";
import { TemplateFormItemProps } from "@/components/shared/form/TemplateFormItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function PasswordField<T extends FieldValues, K extends FieldPath<T>>({
  fieldModel,
  field,
  isForm = true,
  labelPosition = "top",
  labelCls,
}: TemplateFormItemProps<T, K>) {
  const [visiblePassword, setVisiblePassword] = useState<boolean>(false);

  return (
    <FormItemWrapper
      name={fieldModel.name}
      desc={fieldModel.desc}
      isForm={isForm}
      className={labelPosition === "left" ? "flex flex-1 items-center" : "flex-1"}
      labelCls={labelCls}
    >
      <div className="relative flex items-center">
        <Input
          type={visiblePassword ? "text" : "password"}
          placeholder={fieldModel?.placeholder ?? `입력하세요.`}
          {...field}
          value={field?.value ?? ""}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="hover:bg-[#4fc3f7]/30"
          onClick={() => setVisiblePassword((prev) => !prev)}
        >
          {visiblePassword ? <Eye /> : <EyeClosed />}
        </Button>
      </div>
    </FormItemWrapper>
  );
}
