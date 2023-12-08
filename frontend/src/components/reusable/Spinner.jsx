import React from 'react';

const Spinner = ({border}) => {
  return (
    <div className="flex items-center justify-center">
      <div className={`animate-spin rounded-full h-6 w-6 border-t-2 ${border ? border: 'border-sky-50'}`}></div>
    </div>
  );
};

export default Spinner;
