import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function Card({ children, title, description }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center pt-20">
      <section className="m-4 p-8 shadow-card min-h-[350px] max-w-xl w-full rounded-2xl border-2 border-solid border-slate-200">
        {title && <h2 className="text-2xl font-medium m-0 mb-4">{title}</h2>}
        {description && <p className="text-[hsla(243,30%,13%,.63)] text-base m-0 mb-1">{description}</p>}
        {children}
      </section>
    </div>
  );
}
