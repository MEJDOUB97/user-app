import React from 'react';
function Avatar({ name = 'H', size = 'md' }) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return <span className={`avatar avatar-${size}`}>{initials}</span>;
}

export default Avatar;
