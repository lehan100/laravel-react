import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {
  //
}

export default function Logo(props: LogoProps) {
  return (
  <img src='/admin/logo.png' alt='Admin Logo' width={'70%'}/>
  );
}
