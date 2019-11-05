import React from 'react';

export default function Spinner({ isBig }) {
  let className = '';
  if (isBig) {
    className += ' BigSpinner';
  }
  return (
    <span
      aria-busy="true"
      className={className}
    >
      <span
        className="Spinner"
        aria-hidden="true"
      >🌀</span>
    </span>
  );
}