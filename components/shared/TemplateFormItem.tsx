"use client";
import { Eye, EyeClosed, Image as ImageIcon, Upload, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import type { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form";

import type z from "zod";

import Combobox, { Item } from "@/components/shared/Combobox";
import { InputRange } from "@/components/shared/InputRange";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Language } from "@/lib/i18n/config";
import { useTranslation } from "@/lib/i18n/react";
import type zodFile from "@/lib/schema/file";
import type { Model } from "@/lib/schema/model";
import { cn } from "@/lib/utils";

interface FormItemComponentProps {
  children: React.ReactNode;
  isForm: boolean;
  fieldModel: Model;
  labelCls?: string;
  className?: string;
  lng?: Language;
}
function FormItemComponent({
  children,
  fieldModel,
  labelCls,
  isForm,
  className,
  lng = "ko",
}: FormItemComponentProps) {
  const { t } = useTranslation(lng, "translation", {
    useSuspense: false,
  });

  if (isForm)
    return (
      <FormItem className={cn(className)}>
        <FormLabel className={cn(labelCls)}>{t(fieldModel.name)}</FormLabel>
        <FormControl>{children}</FormControl>
        {fieldModel.desc && (
          <FormDescription className="text-gray-500 text-xs">{fieldModel.desc}</FormDescription>
        )}
        <FormMessage />
      </FormItem>
    );
  else return <>{children}</>;
}
interface TemplateFormItemProps<T extends FieldValues, K extends FieldPath<T>> {
  fieldModel: Model;
  field: ControllerRenderProps<T, K>;
  labelPosition?: "top" | "left";
  labelCls?: string;
  isForm?: boolean;
  lng?: Language;
}

export default function TemplateFormItem<T extends FieldValues, K extends FieldPath<T>>({
  fieldModel,
  field,
  labelPosition = "top",
  labelCls,
  isForm = true,
  lng = "ko",
}: TemplateFormItemProps<T, K>) {
  const { t } = useTranslation(lng, "translation", {
    useSuspense: false,
  });

  const enums = useMemo(() => {
    if (fieldModel?.enums) {
      if (fieldModel.type === "hex-enum")
        return Object.entries(fieldModel.enums).map(([label, value]) => ({
          label,
          value: String(value),
        }));

      return Object.entries(fieldModel.enums).map(([label, value]) => ({ label, value }));
    } else if (fieldModel.type === "switch")
      return [
        { label: "ON", value: "true" },
        { label: "OFF", value: "false" },
      ];

    return [];
  }, [fieldModel?.enums]);
  const fileExt = useMemo(() => {
    if (fieldModel?.accept) return fieldModel.accept.join(",");
  }, []);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [inputValue, setInputValue] = useState(field.value);
  const [visiblePassword, setVisiblePassword] = useState<boolean>(false);

  const handleFileInput = () => {
    fileInputRef?.current?.click();
  };
  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (fieldModel.multiple) {
      // 동일한 파일 필터링. name이 같은 파일은 동일 파일로 간주
      const prev = inputValue || [];
      const filtered = files.filter(({ name }) => !prev.some(({ name: n }: File) => n === name));
      field.onChange([...prev, ...filtered]);
    } else {
      const [file] = files;
      field.onChange(file);
    }
  };

  const handleFileRemove = (i?: number) => {
    if (i == null) {
      field.onChange([]);
    } else {
      const removed = [...inputValue.slice(0, i), ...inputValue.slice(i + 1)];
      field.onChange(removed);
    }
  };

  useEffect(() => {
    const value = field?.value;
    setInputValue(value);
  }, [field]);

  switch (fieldModel.type) {
    case "number": {
      if (!!fieldModel.range)
        return (
          <FormItemComponent
            fieldModel={fieldModel}
            isForm={isForm}
            className={labelPosition === "left" ? "flex flex-1 items-center" : "flex-1"}
            labelCls={labelCls}
          >
            <InputRange
              type="number"
              placeholder={fieldModel?.placeholder ?? t("Please enter")}
              {...field}
              value={field?.value}
            />
          </FormItemComponent>
        );
      return (
        <FormItemComponent
          fieldModel={fieldModel}
          isForm={isForm}
          className={labelPosition === "left" ? "flex flex-1 items-center" : "flex-1"}
          labelCls={labelCls}
        >
          <Input
            type="number"
            placeholder={fieldModel?.placeholder ?? t("Please enter")}
            {...field}
            value={field?.value ?? ""}
            onChange={(e) =>
              field.onChange({ ...e, target: { ...e.target, value: Number(e.target.value) } })
            }
          />
        </FormItemComponent>
      );
    }
    case "email": {
      return (
        <FormItemComponent
          fieldModel={fieldModel}
          isForm={isForm}
          className={labelPosition === "left" ? "flex flex-1 items-center" : "flex-1"}
          labelCls={labelCls}
        >
          <Input
            type="email"
            placeholder={fieldModel?.placeholder ?? t("Please enter")}
            {...field}
            value={field?.value ?? ""}
          />
        </FormItemComponent>
      );
    }
    case "textarea": {
      return (
        <FormItemComponent
          fieldModel={fieldModel}
          isForm={isForm}
          className={labelPosition === "left" ? "flex flex-1 items-center" : "flex-1"}
          labelCls={labelCls}
        >
          <Textarea
            readOnly={fieldModel.readOnly}
            placeholder={fieldModel?.placeholder ?? t("Please enter")}
            {...field}
            value={field?.value ?? ""}
          />
        </FormItemComponent>
      );
    }
    case "password": {
      return (
        <FormItemComponent
          fieldModel={fieldModel}
          isForm={isForm}
          className={labelPosition === "left" ? "flex flex-1 items-center" : "flex-1"}
          labelCls={labelCls}
        >
          <div className="relative flex items-center">
            <Input
              type={visiblePassword ? "text" : "password"}
              placeholder={fieldModel?.placeholder ?? t("Please enter")}
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
        </FormItemComponent>
      );
    }
    case "boolean": {
      return (
        <FormItemComponent
          fieldModel={fieldModel}
          isForm={isForm}
          className={labelPosition === "left" ? "flex flex-1 items-center" : "flex-1"}
          labelCls={labelCls}
        >
          <div className="relative flex items-center">
            <Switch
              {...field}
              checked={field.value}
              onCheckedChange={field.onChange}
              id={t(fieldModel.name)}
            />
          </div>
        </FormItemComponent>
      );
    }
    case "switch":
    case "hex-enum":
    case "enum": {
      return (
        <FormItemComponent
          fieldModel={fieldModel}
          isForm={isForm}
          className={labelPosition === "left" ? "flex flex-1 items-center" : "flex-1"}
          labelCls={labelCls}
        >
          <Combobox
            {...field}
            multiple={fieldModel.multiple}
            placeholder={fieldModel.placeholder || "입력하세요"}
            readOnly={fieldModel.readOnly}
            items={enums as Item[]}
            className="flex-1"
            contentCls="left-0"
            onValueChange={(v) => field.onChange(v)}
          />
        </FormItemComponent>
      );
    }
    case "file": {
      const getFileProperties = ({ file }: { file: File | z.infer<typeof zodFile> }) => {
        if (!file) return { url: "", name: "" };

        if (file instanceof File) {
          const { type = "", name = "", size = 0, lastModified = Date.now() } = file;
          return {
            isImageType: type.startsWith("image"),
            url: URL.createObjectURL(file),
            name,
            size,
            lastModified,
          };
        } else {
          const { mimetype = "", url = "", originalname = "", size = 0, lastModified } = file || {};
          return {
            isImageType: mimetype.startsWith("image"),
            url: `/api/files${url}`,
            name: originalname,
            size,
            lastModified,
          };
        }
      };

      return fieldModel.multiple ? (
        <FormItem>
          <FormLabel>
            {t(fieldModel.name)}
            <Input
              {...field}
              value=""
              ref={fileInputRef}
              accept={fileExt}
              type="file"
              className="hidden w-0"
              multiple={fieldModel.multiple}
              onChange={onChangeFile}
            />
          </FormLabel>
          <FormControl>
            <div className="flex w-full flex-col items-end">
              <Button type="button" variant="outline" onClick={handleFileInput}>
                파일 선택
              </Button>
              {inputValue?.length > 0 ? (
                inputValue?.map((file: File | z.infer<typeof zodFile>, i: number) => {
                  return file ? (
                    <div key={i} className="flex w-full items-center">
                      <Image
                        src={getFileProperties({ file }).url}
                        alt="preview"
                        className="mr-2 size-20 max-h-20 max-w-20 rounded-full border object-contain"
                        width="0"
                        height="0"
                        unoptimized
                      />
                      <p className="flex-1 overflow-hidden text-ellipsis ps-2 text-sm">
                        {getFileProperties({ file }).name || "선택된 파일이 없습니다."}{" "}
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        className="size-6 max-w-6 flex-1"
                        onClick={() => handleFileRemove(i)}
                      >
                        <X />
                      </Button>
                    </div>
                  ) : (
                    <ImageIcon className="mr-2 size-20" strokeWidth={1} />
                  );
                })
              ) : (
                <></>
              )}
            </div>
          </FormControl>

          {fieldModel.desc && (
            <FormDescription className="text-gray-500 text-xs">{fieldModel.desc}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      ) : (
        <FormItem>
          <FormLabel>
            {t(fieldModel.name)}
            <Input
              {...field}
              ref={fileInputRef}
              accept={fileExt}
              type="file"
              className="hidden w-0"
              value=""
              multiple={fieldModel.multiple}
              onChange={onChangeFile}
            />
          </FormLabel>
          <FormControl>
            <div className="flex w-full items-center">
              {inputValue?.length ? (
                <Image
                  src={getFileProperties({ file: inputValue }).url}
                  alt="preview"
                  className="mr-2 size-20 max-h-20 max-w-20 rounded-full border object-contain"
                  width="0"
                  height="0"
                  unoptimized
                />
              ) : (
                <Upload className="mr-2 size-20" strokeWidth={1} />
              )}
              <Button type="button" variant="outline" onClick={handleFileInput}>
                파일 선택
              </Button>
              <p className="flex-1 overflow-hidden text-ellipsis ps-2 text-sm">
                {getFileProperties({ file: inputValue }).name || "선택된 파일이 없습니다."}{" "}
              </p>
              {inputValue && (
                <Button
                  type="button"
                  variant="ghost"
                  className="size-6 max-w-6 flex-1"
                  onClick={() => handleFileRemove()}
                >
                  <X />
                </Button>
              )}
            </div>
          </FormControl>

          {fieldModel.desc && (
            <FormDescription className="text-gray-500 text-xs">{fieldModel.desc}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      );
    }
    case "radio": {
      return (
        <FormItemComponent
          fieldModel={fieldModel}
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
        </FormItemComponent>
      );
    }
    case "date": {
      if (!!fieldModel.range)
        return (
          <FormItemComponent
            fieldModel={fieldModel}
            isForm={isForm}
            className={labelPosition === "left" ? "flex flex-1 items-center" : "flex-1"}
            labelCls={labelCls}
          >
            <InputRange type="date" {...field} value={field?.value} />
          </FormItemComponent>
        );
      return (
        <FormItemComponent
          fieldModel={fieldModel}
          isForm={isForm}
          className={labelPosition === "left" ? "flex flex-1 items-center" : "flex-1"}
          labelCls={labelCls}
        >
          <Input type="date" {...field} value={field?.value ?? ""} />
        </FormItemComponent>
      );
    }
    case "datetime-local": {
      if (!!fieldModel.range)
        return (
          <FormItemComponent
            fieldModel={fieldModel}
            isForm={isForm}
            className={labelPosition === "left" ? "flex flex-1 items-center" : "flex-1"}
            labelCls={labelCls}
          >
            <InputRange type="datetime-local" {...field} value={field?.value} />
          </FormItemComponent>
        );
      return (
        <FormItemComponent
          fieldModel={fieldModel}
          isForm={isForm}
          className={labelPosition === "left" ? "flex flex-1 items-center" : "flex-1"}
          labelCls={labelCls}
        >
          <Input type="datetime-local" {...field} value={field?.value ?? ""} />
        </FormItemComponent>
      );
    }
    default: {
      return (
        <FormItemComponent
          fieldModel={fieldModel}
          isForm={isForm}
          className={labelPosition === "left" ? "flex flex-1 items-center" : "flex-1"}
          labelCls={labelCls}
        >
          <div className="relative w-full">
            <Input
              readOnly={fieldModel.readOnly}
              placeholder={fieldModel?.placeholder ?? t("Please enter")}
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
                onClick={() => field.onChange("")}
              >
                <X />
              </Button>
            )}
          </div>
        </FormItemComponent>
      );
    }
  }
}
