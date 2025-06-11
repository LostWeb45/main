import { cn } from "@/lib/utils";
import React from "react";

interface Props {
  className?: string;
}

export const Container: React.FC<React.PropsWithChildren<Props>> = ({
  className,
  children,
}) => {
  return (
    <div className={cn(" mt-[30px] mx-auto max-w-[1360px]", className)}>
      {children}
    </div>
  );
};
