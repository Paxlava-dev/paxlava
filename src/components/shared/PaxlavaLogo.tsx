interface PaxlavaLogoProps {
  size?: number
  className?: string
}

export function PaxlavaLogo({ size = 36, className = '' }: PaxlavaLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="36" height="36" rx="10" fill="#1C1C1C" />
      {/* Outer diamond — baklava cut */}
      <polygon points="18,4 32,18 18,32 4,18" fill="none" stroke="#E8A838" strokeWidth="1.8" />
      {/* Mid diamond — amber fill */}
      <polygon points="18,9 27,18 18,27 9,18" fill="#E8A838" stroke="#1C1C1C" strokeWidth="0.5" />
      {/* Inner diamond — dark cutout */}
      <polygon points="18,13 23,18 18,23 13,18" fill="#1C1C1C" />
      {/* Teal corner dots */}
      <circle cx="18" cy="4"  r="2.2" fill="#23A094" />
      <circle cx="32" cy="18" r="2.2" fill="#23A094" />
      <circle cx="18" cy="32" r="2.2" fill="#23A094" />
      <circle cx="4"  cy="18" r="2.2" fill="#23A094" />
      {/* P letterform in amber zone */}
      <line   x1="14" y1="15" x2="14" y2="21" stroke="#FAF8F3" strokeWidth="1.4" strokeLinecap="round" />
      <path   d="M14 15 Q18 15 18 17.5 Q18 20 14 20" stroke="#FAF8F3" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </svg>
  )
}
