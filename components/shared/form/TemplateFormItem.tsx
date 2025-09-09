"use client";
import type { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form";
import { BooleanField } from "@/components/shared/form/fields/BooleanField";
import { ComboboxField } from "@/components/shared/form/fields/ComboboxField";
import { DateField } from "@/components/shared/form/fields/DateField";
import { FileField } from "@/components/shared/form/fields/FileField";
import { NumberField } from "@/components/shared/form/fields/NumberField";
import { PasswordField } from "@/components/shared/form/fields/PasswordField";
import { RadioField } from "@/components/shared/form/fields/RadioField";
import { TextareaField } from "@/components/shared/form/fields/TextareaField";
import { TextField } from "@/components/shared/form/fields/TextField";
import type { Model } from "@/lib/schema/model";

export interface TemplateFormItemProps<T extends FieldValues, K extends FieldPath<T>> {
  fieldModel: Model;
  field: ControllerRenderProps<T, K>;
  labelPosition?: "top" | "left";
  labelCls?: string;
  isForm?: boolean;
}

export function TemplateFormItem<T extends FieldValues, K extends FieldPath<T>>(
  props: TemplateFormItemProps<T, K>,
) {
  switch (props.fieldModel.type) {
    case "number":
      return <NumberField {...props} />;
    case "textarea":
      return <TextareaField {...props} />;
    case "password":
      return <PasswordField {...props} />;
    case "switch":
    case "boolean":
      return <BooleanField {...props} />;
    case "hex-enum":
    case "enum":
      return <ComboboxField {...props} />;
    case "file":
      return <FileField {...props} />;
    case "radio":
      return <RadioField {...props} />;
    case "datetime-local":
    case "date":
      return <DateField {...props} />;
    default:
      return <TextField {...props} />;
  }
}
