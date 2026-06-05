import React from 'react';
function EmptyState({ title, description, action }) {
  return (
    <div className="empty-screen">
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}

export default EmptyState;
