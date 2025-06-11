import clsx from "clsx";
import Link from "next/link";
import React from "react";

type TitleSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

interface Props {
  size?: TitleSize;
  className?: string;
  text: string;
  url?: string;
}

export const Title: React.FC<Props> = ({
  text,
  size = "xl",
  className,
  url,
}) => {
  const mapTagBySize = {
    xs: "h5",
    sm: "h4",
    md: "h3",
    lg: "h2",
    xl: "h1",
    "2xl": "h1",
  } as const;

  const mapClassNameBySize = {
    xs: "text-[16px]",
    sm: "text-[22px]",
    md: "text-[26px]",
    lg: "text-[32px]",
    xl: "text-[34px]",
    "2xl": "text-[48px]",
  } as const;

  const icon = url ? (
    <Link href={url} rel="noopener noreferrer">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="26"
        height="26"
        viewBox="0 0 26 26"
        fill="none"
        className="ml-[3px] mb-[2px] inline-block opacity-60"
      >
        <path
          d="M2 0V4H19.18L0 23.18L2.82 26L22 6.82V24H26V0H2Z"
          fill="#2E1A1A"
        />
      </svg>
    </Link>
  ) : null;

  return React.createElement(
    mapTagBySize[size],
    {
      className: clsx(mapClassNameBySize[size], className),
    },
    <>
      {text} {icon}
    </>
  );
};
