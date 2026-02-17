import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { twMerge } from "tailwind-merge";

interface InputProps {
  name: string;
  label?: string;
}

export const RHFInput: React.FC<
  InputProps & React.InputHTMLAttributes<HTMLInputElement>
> = ({ name, label, ...props }) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="text-left">
          <div className="mb-3">
            {label && (
              <label
                className="block text-gray-700 text-sm font-medium mb-1"
                htmlFor={name}
              >
                {label}
              </label>
            )}
            <input
              {...field}
              className={twMerge(
                `border rounded w-full py-2 px-3 text-sm text-gray-900 leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                  error ? "border-red-400" : "border-gray-200"
                }`,
              )}
              {...props}
            />
            {error && (
              <p className="text-red-500 text-xs mt-1">
                {error.message}
              </p>
            )}
          </div>
        </div>
      )}
    />
  );
};
