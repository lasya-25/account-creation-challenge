import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/16/solid';

interface Props {
  info: string;
  isGeneric?: boolean;
}

export function Error({ info, isGeneric = false }: Props) {
  const style = `rounded relative text-red-500 ${isGeneric
      ? 'px-3 py-4 bg-red-100 border border-red-400'
      : 'py-2'
  }`;
  return (
    <div className={style} role="alert">
        <ExclamationTriangleIcon className="inline-block align-middle mr-2 w-5 h-5 text-red-500" />
        <span className="block sm:inline">{info}</span>
    </div>
  );
}
