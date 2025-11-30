// Reusable icon components

import React from 'react';

interface IconProps {
    width?: number;
    height?: number;
    className?: string;
    color?: string;
}

export function UploadIcon({ width = 24, height = 24, className, color = 'currentColor' }: IconProps) {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} className={className}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="17 8 12 3 7 8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="12" y1="3" x2="12" y2="15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function ClockIcon({ width = 24, height = 24, className, color = 'currentColor' }: IconProps) {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} className={className}>
            <circle cx="12" cy="12" r="10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function FileIcon({ width = 24, height = 24, className, color = 'currentColor' }: IconProps) {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} className={className}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="14 2 14 8 20 8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function FileTextIcon({ width = 24, height = 24, className, color = 'currentColor' }: IconProps) {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} className={className}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="14 2 14 8 20 8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="16" y1="13" x2="8" y2="13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="16" y1="17" x2="8" y2="17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function DatabaseIcon({ width = 24, height = 24, className, color = 'currentColor' }: IconProps) {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} className={className}>
            <ellipse cx="12" cy="5" rx="9" ry="3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function LayersIcon({ width = 24, height = 24, className, color = 'currentColor' }: IconProps) {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} className={className}>
            <path d="M12 2L2 7l10 5 10-5-10-5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 17l10 5 10-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12l10 5 10-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function ArrowRightIcon({ width = 24, height = 24, className, color = 'currentColor' }: IconProps) {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} className={className}>
            <path d="M5 12h14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function PlusIcon({ width = 24, height = 24, className, color = 'currentColor' }: IconProps) {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} className={className}>
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="12" y1="8" x2="12" y2="16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="8" y1="12" x2="16" y2="12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function CheckIcon({ width = 24, height = 24, className, color = 'currentColor' }: IconProps) {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} className={className}>
            <polyline points="20 6 9 17 4 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function XIcon({ width = 24, height = 24, className, color = 'currentColor' }: IconProps) {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} className={className}>
            <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function AlertCircleIcon({ width = 24, height = 24, className, color = 'currentColor' }: IconProps) {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} className={className}>
            <circle cx="12" cy="12" r="10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function DownloadIcon({ width = 24, height = 24, className, color = 'currentColor' }: IconProps) {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} className={className}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="7 10 12 15 17 10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="12" y1="15" x2="12" y2="3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function LoaderIcon({ width = 24, height = 24, className, color = 'currentColor' }: IconProps) {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} className={className}>
            <line x1="12" y1="2" x2="12" y2="6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="12" y1="18" x2="12" y2="22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="2" y1="12" x2="6" y2="12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="18" y1="12" x2="22" y2="12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function ImageIcon({ width = 24, height = 24, className, color = 'currentColor' }: IconProps) {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} className={className}>
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="8.5" cy="8.5" r="1.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="21 15 16 10 5 21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
