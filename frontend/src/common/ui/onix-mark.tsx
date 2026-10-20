import type { CSSProperties } from 'react'

export interface OnixMarkProps {
  className?: string
  style?: CSSProperties
}

/**
 * Onix brand mark — the yellow angular arrow. Rendered as a real SVG component
 * so it stays crisp at any size and needs no asset pipeline.
 * Gradient/shadow ids are namespaced to avoid collisions when instantiated more
 * than once on a page.
 */
export function OnixMark({ className, style }: OnixMarkProps) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="47 42 72 82"
      fill="none"
      role="img"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#onix-mark-shadow)">
        <path
          d="M98.2363 57.9556L71.4503 44L69.0785 46.8889C59.9522 58.0222 62.9299 72.6556 75.4076 80.9889L58.3152 72.0889C48.467 84.1 52.695 100.189 67.7637 108.044L94.5497 122C103.676 110.867 100.698 96.2333 88.2206 87.9L105.313 96.8L107.685 93.9111C117.533 81.9 113.305 65.8111 98.2363 57.9556Z"
          fill="#FFC93C"
        />
        <path
          d="M98.2363 57.9556L71.4503 44L69.0785 46.8889C59.9522 58.0222 62.9299 72.6556 75.4076 80.9889L58.3152 72.0889C48.467 84.1 52.695 100.189 67.7637 108.044L94.5497 122C103.676 110.867 100.698 96.2333 88.2206 87.9L105.313 96.8L107.685 93.9111C117.533 81.9 113.305 65.8111 98.2363 57.9556Z"
          stroke="url(#onix-mark-stroke)"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="bevel"
        />
        <path
          d="M98.2363 57.9556L71.4503 44L69.0785 46.8889C59.9522 58.0222 62.9299 72.6556 75.4076 80.9889L58.3152 72.0889C48.467 84.1 52.695 100.189 67.7637 108.044L94.5497 122C103.676 110.867 100.698 96.2333 88.2206 87.9L105.313 96.8L107.685 93.9111C117.533 81.9 113.305 65.8111 98.2363 57.9556Z"
          stroke="url(#onix-mark-gloss)"
          strokeOpacity="0.2"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="bevel"
        />
      </g>
      <defs>
        <filter
          id="onix-mark-shadow"
          x="15.25"
          y="40.3348"
          width="102.5"
          height="128.33"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="-1" dy="2" />
          <feGaussianBlur stdDeviation="2.5" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="-5" dy="8" />
          <feGaussianBlur stdDeviation="4.5" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.07 0" />
          <feBlend mode="normal" in2="effect1" result="effect2" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="-12" dy="18" />
          <feGaussianBlur stdDeviation="6.5" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0" />
          <feBlend mode="normal" in2="effect2" result="effect3" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="-22" dy="31" />
          <feGaussianBlur stdDeviation="7.5" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.01 0" />
          <feBlend mode="normal" in2="effect3" result="effect4" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect4" result="shape" />
        </filter>
        <linearGradient
          id="onix-mark-stroke"
          x1="97.4572"
          y1="64.0582"
          x2="57.5058"
          y2="98.1994"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFE08E" />
          <stop offset="1" stopColor="#FFBC0E" />
        </linearGradient>
        <linearGradient
          id="onix-mark-gloss"
          x1="99.538"
          y1="50.019"
          x2="120.817"
          y2="37.428"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.3" stopColor="white" stopOpacity="0" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
      </defs>
    </svg>
  )
}
