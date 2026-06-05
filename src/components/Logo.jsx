import React from 'react';
import { Landmark } from 'lucide-react';

function Logo({ compact = false }) {
  return (
    <div className={`logo ${compact ? 'logo-compact' : ''}`}>
      <span className="logo-mark">
        <Landmark size={18} />
      </span>
      <div>
        <strong>Hssabna</strong>
        {!compact ? <small>Built with care in Morocco.</small> : null}
      </div>
    </div>
  );
}

export default Logo;
