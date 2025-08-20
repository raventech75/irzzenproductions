"use client";

import React, { ReactNode } from "react";

// Icônes locales (mini SVG)
const CameraIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className={className}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M23 19V7a2 2 0 0 0-2-2h-3.17a2 2 0 0 1-1.41-.59l-1.83-1.82A2 2 0 0 0 12.17 2H11.83a2 2 0 0 0-1.42.59L8.59 5.41A2 2 0 0 1 7.17 6H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h17a2 2 0 0 0 2-2z" />
    <circle cx="12" cy="13" r="3" />
  </svg>
);

const HeartIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className={className}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20.8 4.6c-1.7-1.7-4.6-1.7-6.3 0L12 7.1 9.5 4.6c-1.7-1.7-4.6-1.7-6.3 0s-1.7 4.6 0 6.3L12 21l8.8-10.1c1.7-1.7 1.7-4.6 0-6.3z" />
  </svg>
);

const FilmIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className={className}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
    <line x1="7" y1="2" x2="7" y2="22" />
    <line x1="17" y1="2" x2="17" y2="22" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <line x1="2" y1="7" x2="7" y2="7" />
    <line x1="2" y1="17" x2="7" y2="17" />
    <line x1="17" y1="17" x2="22" y2="17" />
    <line x1="17" y1="7" x2="22" y2="7" />
  </svg>
);

const LandmarkIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className={className}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 22h18" />
    <path d="M6 22V12h12v10" />
    <path d="M12 2l9 4H3z" />
  </svg>
);

// mapping icône par clé de module
const ICONS: Record<string, ReactNode> = {
  shootingPreparatifs: <CameraIcon className="w-4 h-4" />,
  prisesMairie: <LandmarkIcon className="w-4 h-4" />,
  seanceCouple: <HeartIcon className="w-4 h-4" />,
  videoMomentsCles: <FilmIcon className="w-4 h-4" />,
};

export function ModuleBullet({
  children,
  iconKey,
}: {
  children: ReactNode;
  iconKey: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 text-orange-500">
        {ICONS[iconKey] ?? <span className="inline-block w-2 h-2 rounded-full bg-orange-400" />}
      </span>
      <span className="text-sm">{children}</span>
    </div>
  );
}