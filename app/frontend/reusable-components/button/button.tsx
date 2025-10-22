import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  children: ReactNode;
}

const classes = 'w-full inline-block mt-6 py-3 px-6 bg-[hsla(244,49%,49%,1)] text-white rounded-lg text-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400';

export function Button({ href, children, ...props }: Props) {
  if (href) {
    return (
      <Link to={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
