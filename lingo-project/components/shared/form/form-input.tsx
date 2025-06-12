"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { RequiredSymbol } from "../requried-symbol";
import { Input } from "@/components/ui/input";
import { ClearButton } from "../clear-button";
import { ErrorText } from "../error-text";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  required?: boolean;
  className?: string;
  disablesDel?: boolean;
}

export const FormInput: React.FC<Props> = ({
  className,
  name,
  label,
  required,
  disablesDel,
  ...props
}) => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();

  const errotText = errors?.[name]?.message as string;

  const text = watch(name);

  const onClickClear = () => {
    setValue(name, "", { shouldValidate: true });
  };

  return (
    <div className={className}>
      {label && (
        <p className="font-medium sm:mb-2">
          {label} {required && <RequiredSymbol />}
        </p>
      )}

      <div className="relative">
        <Input className="sm:h-12" {...register(name)} {...props} />

        {Boolean(text) && !disablesDel && (
          <ClearButton onClick={onClickClear} />
        )}
      </div>

      {errotText && <ErrorText text={errotText} />}
    </div>
  );
};
