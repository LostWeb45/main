"use client";

import DOMPurify from "dompurify";

interface SafeHTMLProps {
  html: string;
}

const SafeHTML: React.FC<SafeHTMLProps> = ({ html }) => {
  let sanitizedHTML = html;

  try {
    sanitizedHTML = DOMPurify.sanitize(html);
  } catch (error) {
    console.log("Странная ошибка при санитизации HTML (пофиксить)");
  }

  return (
    <div
      className="ml-[5px]"
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  );
};

export default SafeHTML;
