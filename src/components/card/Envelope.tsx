'use client';

import { memo } from 'react';

interface EnvelopeProps {
  recipientName: string;
  isOpen: boolean;
  onClick: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export const Envelope = memo(function Envelope({
  recipientName,
  isOpen,
  onClick,
  onKeyDown,
}: EnvelopeProps) {
  const ariaLabel = isOpen
    ? 'Envelope opened. Letter revealed.'
    : 'Envelope. Click to interact.';

  return (
    <div
      className="envelope"
      tabIndex={0}
      role="button"
      aria-label={ariaLabel}
      onClick={onClick}
      onKeyDown={onKeyDown}
      style={{ cursor: isOpen ? 'default' : 'pointer' }}
    >
      <div className="envelope-inner">
        {/* Back face (visible first) */}
        <div className="envelope-face envelope-back">
          <div className="envelope-body-back">
            <div className="flap-back" />
            <div className="fold-line fold-line-left" />
            <div className="fold-line fold-line-right" />
          </div>
        </div>

        {/* Front face (revealed on flip) */}
        <div className="envelope-face envelope-front">
          <div className="envelope-body-front">
            <div className="flap-front">
              <div className="flap-inner" />
            </div>
            <div className="recipient-name">{recipientName}</div>
          </div>
        </div>
      </div>
    </div>
  );
});
