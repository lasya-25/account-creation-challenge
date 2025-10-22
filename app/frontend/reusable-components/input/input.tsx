import React from 'react';
import { InformationCircleIcon } from '@heroicons/react/16/solid';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  tooltip?: string;
}

export function Input({ label, tooltip, ...props }: Props) {
  const id = label.replace(/ /gm, '_');

  return (
    <div className="flex flex-col border-b border-gray-300 my-4">
      <label htmlFor={id} className="block text-sm text-gray-600">
        {label}
        {tooltip && (
          <span className="relative group inline-flex items-center">
            <InformationCircleIcon className="w-3 h-3 mt-2 ml-1 text-gray-400 cursor-pointer" />
            <span className="absolute left-full ml-2 -top-1/2 hidden group-hover:block group-focus-within:block w-56 bg-gray-700 text-white text-xs rounded py-1 px-2 text-center z-10">{tooltip}</span>
          </span>
        )}
      </label>
      <input
        id={id}
        className="block w-full appearance-none bg-transparent border-none text-gray-700 py-1 focus:outline-none" 
        {...props}
      />
    </div>
  );
}
