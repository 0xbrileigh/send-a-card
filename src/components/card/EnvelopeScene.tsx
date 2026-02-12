'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Envelope } from './Envelope';
import { Letter } from './Letter';
import { PhotosContainer } from './PhotosContainer';
import { Lightbox } from './Lightbox';
import { Hearts } from './backgrounds/Hearts';
import { Snowflakes } from './backgrounds/Snowflakes';
import { Confetti } from './backgrounds/Confetti';
import type { EnvelopeState, AnimationType } from '@/lib/types';
import '@/styles/envelope.css';
import '@/styles/present.css';
import '@/styles/lightbox.css';
import '@/styles/animations.css';

interface EnvelopeSceneProps {
  recipientName: string;
  occasion: string;
  message: string;
  fromName: string;
  bgColor: string;
  envelopeColor: string;
  accentColor: string;
  textColor: string;
  animationType: AnimationType;
  includePhotos: boolean;
  photoUrls: string[];
  /** When true, renders in a compact preview mode (no interactions) */
  preview?: boolean;
  /** Starting state — use 'open' in builder so letter is visible immediately */
  initialState?: EnvelopeState;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function EnvelopeScene({
  recipientName,
  occasion,
  message,
  fromName,
  bgColor,
  envelopeColor,
  accentColor,
  textColor,
  animationType,
  includePhotos,
  photoUrls,
  preview = false,
  initialState = 'back',
}: EnvelopeSceneProps) {
  const [state, setState] = useState<EnvelopeState>(initialState);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);
  const tiltRef = useRef({
    targetRx: 0, targetRy: 0, targetTx: 0, targetTy: 0,
    currentRx: 0, currentRy: 0, currentTx: 0, currentTy: 0,
    ease: 0.07,
    maxRotate: 10,
    maxTranslate: 5,
    perspective: 900,
  });
  const tiltMultiplierRef = useRef(initialState === 'open' ? 0 : 1.0);
  const [isTouch, setIsTouch] = useState(false);

  // Detect touch devices
  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Animation loop (tilt + breathing)
  useEffect(() => {
    if (preview) return;

    function loop(timestamp: number) {
      const t = tiltRef.current;
      t.currentRx = lerp(t.currentRx, t.targetRx, t.ease);
      t.currentRy = lerp(t.currentRy, t.targetRy, t.ease);
      t.currentTx = lerp(t.currentTx, t.targetTx, t.ease);
      t.currentTy = lerp(t.currentTy, t.targetTy, t.ease);

      const breathe = state === 'open'
        ? 1
        : 1 + 0.012 * Math.sin((timestamp * 2 * Math.PI) / 4000);

      if (wrapperRef.current) {
        wrapperRef.current.style.transform =
          `perspective(${t.perspective}px) ` +
          `rotateX(${t.currentRx.toFixed(3)}deg) ` +
          `rotateY(${t.currentRy.toFixed(3)}deg) ` +
          `translate(${t.currentTx.toFixed(2)}px, ${t.currentTy.toFixed(2)}px) ` +
          `scale(${breathe.toFixed(5)})`;
      }

      rafIdRef.current = requestAnimationFrame(loop);
    }

    rafIdRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [preview, state]);

  // Mouse move handler for tilt
  useEffect(() => {
    if (preview || isTouch) return;

    function handleMouseMove(e: MouseEvent) {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const nx = (e.clientX - cx) / cx;
      const ny = (e.clientY - cy) / cy;
      const m = tiltMultiplierRef.current;
      const t = tiltRef.current;
      t.targetRx = -ny * t.maxRotate * m;
      t.targetRy = nx * t.maxRotate * m;
      t.targetTx = nx * t.maxTranslate * m;
      t.targetTy = ny * t.maxTranslate * m;
    }

    function handleMouseLeave() {
      const t = tiltRef.current;
      t.targetRx = 0;
      t.targetRy = 0;
      t.targetTx = 0;
      t.targetTy = 0;
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [preview, isTouch]);

  const transition = useCallback(() => {
    if (preview) return;
    setState(prev => {
      if (prev === 'back') return 'front';
      if (prev === 'front') {
        // Stop tilt on open
        tiltMultiplierRef.current = 0;
        const t = tiltRef.current;
        t.targetRx = 0;
        t.targetRy = 0;
        t.targetTx = 0;
        t.targetTy = 0;
        return 'open';
      }
      return prev; // already open, no change
    });
  }, [preview]);

  const handleEnvelopeClick = useCallback(() => {
    transition();
  }, [transition]);

  const handleEnvelopeKeydown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      transition();
    }
  }, [transition]);

  const openLightbox = useCallback((src: string, alt: string) => {
    setLightboxSrc(src);
    setLightboxAlt(alt);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxSrc(null);
    setLightboxAlt('');
  }, []);

  const promptText = state === 'back'
    ? 'Click to rotate'
    : state === 'front'
    ? 'Click to open'
    : null;

  const stateClass = `state-${state}`;

  const cssVars = {
    '--bg-color': bgColor,
    '--envelope-color': envelopeColor,
    '--accent-color': accentColor,
    '--text-color': textColor,
  } as React.CSSProperties;

  // Background animation component
  const BackgroundAnimation = () => {
    switch (animationType) {
      case 'hearts': return <Hearts />;
      case 'snowflakes': return <Snowflakes />;
      case 'confetti': return <Confetti />;
      default: return null;
    }
  };

  return (
    <div className="card-viewer" style={cssVars}>
      {/* SVG Filters — Wes Anderson–style textured paper */}
      <svg className="svg-defs" aria-hidden="true">
        <defs>
          <filter id="paper-grain" x="-5%" y="-5%" width="110%" height="110%">
            {/* Fine grain — visible fiber texture */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency={0.65}
              numOctaves={5}
              stitchTiles="stitch"
              result="fineNoise"
            />
            <feColorMatrix
              in="fineNoise"
              type="saturate"
              values="0"
              result="grayFine"
            />
            <feComponentTransfer in="grayFine" result="fadedFine">
              <feFuncA type="linear" slope={0.35} intercept={0} />
            </feComponentTransfer>

            {/* Coarse grain — larger paper fibers */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency={0.25}
              numOctaves={3}
              seed={2}
              stitchTiles="stitch"
              result="coarseNoise"
            />
            <feColorMatrix
              in="coarseNoise"
              type="saturate"
              values="0"
              result="grayCoarse"
            />
            <feComponentTransfer in="grayCoarse" result="fadedCoarse">
              <feFuncA type="linear" slope={0.12} intercept={0} />
            </feComponentTransfer>

            {/* Combine both grain layers */}
            <feMerge result="combinedNoise">
              <feMergeNode in="fadedFine" />
              <feMergeNode in="fadedCoarse" />
            </feMerge>

            {/* Blend with source */}
            <feBlend in="SourceGraphic" in2="combinedNoise" mode="multiply" />
          </filter>

          {/* Envelope-specific filter — very subtle, smooth stationery feel */}
          <filter id="envelope-grain" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={0.9}
              numOctaves={3}
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix
              in="noise"
              type="saturate"
              values="0"
              result="gray"
            />
            <feComponentTransfer in="gray" result="faded">
              <feFuncA type="linear" slope={0.06} intercept={0} />
            </feComponentTransfer>
            <feBlend in="SourceGraphic" in2="faded" mode="multiply" />
          </filter>
        </defs>
      </svg>

      <main className="scene">
        <BackgroundAnimation />

        <div className="envelope-wrapper" ref={wrapperRef}>
          <div className={`envelope-scene ${stateClass}`}>
            {/* Letter + Photos */}
            <div className="letter-container">
              <Letter
                occasion={occasion}
                message={message}
                fromName={fromName}
              />
              {includePhotos && photoUrls.length > 0 && (
                <PhotosContainer
                  photoUrls={photoUrls}
                  isOpen={state === 'open'}
                  onPhotoClick={openLightbox}
                  previewMode={initialState === 'open'}
                />
              )}
            </div>

            {/* Envelope */}
            <Envelope
              recipientName={recipientName}
              isOpen={state === 'open'}
              onClick={handleEnvelopeClick}
              onKeyDown={handleEnvelopeKeydown}
            />
          </div>

          {/* Prompt text */}
          {promptText && (
            <div className={`prompt-text ${state === 'open' ? 'hidden' : ''}`}>
              <span>{promptText}</span>
            </div>
          )}

          {/* Mobile scroll prompt */}
          {includePhotos && photoUrls.length > 0 && (
            <div className="scroll-prompt hidden" aria-hidden="true">
              <span>Scroll down for gifts!</span>
              <svg className="scroll-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 4v12M4 10l6 6 6-6" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
        </div>
      </main>

      {/* Lightbox */}
      {includePhotos && (
        <Lightbox
          src={lightboxSrc}
          alt={lightboxAlt}
          onClose={closeLightbox}
        />
      )}
    </div>
  );
}
