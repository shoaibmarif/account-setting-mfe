import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

export const UserIcon: React.FC<IconProps> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
        <path
            d="M12 12C14.4853 12 16.5 9.98528 16.5 7.5C16.5 5.01472 14.4853 3 12 3C9.51472 3 7.5 5.01472 7.5 7.5C7.5 9.98528 9.51472 12 12 12Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M4.5 20.25C4.5 16.9363 7.85786 14.25 12 14.25C16.1421 14.25 19.5 16.9363 19.5 20.25"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const IdCardIcon: React.FC<IconProps> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
        <rect
            x="3"
            y="5.25"
            width="18"
            height="13.5"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.8"
        />
        <circle cx="8.25" cy="11.25" r="1.75" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 10H17.25" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M12 13.25H15.75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);

export const EmailIcon: React.FC<IconProps> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
        <rect
            x="3"
            y="5.25"
            width="18"
            height="13.5"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.8"
        />
        <path
            d="M5.25 7.5L12 12.75L18.75 7.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const PhoneIcon: React.FC<IconProps> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
        <path
            d="M8.25 3.75H15.75C16.5784 3.75 17.25 4.42157 17.25 5.25V18.75C17.25 19.5784 16.5784 20.25 15.75 20.25H8.25C7.42157 20.25 6.75 19.5784 6.75 18.75V5.25C6.75 4.42157 7.42157 3.75 8.25 3.75Z"
            stroke="currentColor"
            strokeWidth="1.8"
        />
        <path d="M10.25 6.75H13.75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="12" cy="17.25" r="0.75" fill="currentColor" />
    </svg>
);

export const LockIcon: React.FC<IconProps> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
        <rect
            x="5.25"
            y="10.5"
            width="13.5"
            height="9.75"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.8"
        />
        <path
            d="M8.25 10.5V7.875C8.25 5.80493 9.92993 4.125 12 4.125C14.0701 4.125 15.75 5.80493 15.75 7.875V10.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
        />
        <path
            d="M12 14.25V16.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
        />
    </svg>
);

export const InfoCircleIcon: React.FC<IconProps> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 10.25V16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="12" cy="7.5" r="1" fill="currentColor" />
    </svg>
);

export const ArrowLeftIcon: React.FC<IconProps> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
        <path
            d="M15.75 18.75L9 12L15.75 5.25"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);
