import React from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

/**
 * Label component
 * @param {object} props
 * @param {string} [props.htmlFor] - Optional htmlFor attribute
 * @param {React.ReactNode} props.children - Label content
 * @param {string} [props.className] - Additional Tailwind classes
 */
const Label = ({ htmlFor, children, className }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={clsx(
        twMerge(
          "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400",
          className
        )
      )}
    >
      {children}
    </label>
  );
};

export default Label;
