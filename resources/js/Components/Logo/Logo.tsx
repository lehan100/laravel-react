import React from 'react';
interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  //
}

export default function Logo(props: LogoProps) {
  const { className, ...imageProps } = props;
  return (
    <img
      src="/admin/logo.png"
      alt="Admin Logo"
      className={`block object-contain shrink-0 ${className || ''}`}
      {...imageProps}
    />
  );
}
