import React from 'react';
function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  fullWidth = false,
  ...props
}) {
  return (
    <button
      className={`btn btn-${variant} btn-${size} ${fullWidth ? 'btn-block' : ''} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
