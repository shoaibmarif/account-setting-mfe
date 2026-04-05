import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'customMain/hooks';
import { BrandingSection } from './BrandingSection';
import { CardSection } from './CardSection';

interface AuthLayoutProps {
    children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="min-h-screen relative font-sans">
            {/* Background Image Overlay */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: theme === 'dark'
                        ? `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${__webpack_public_path__}assets/images/bg-login.webp)`
                        : `linear-gradient(#02083ccc, #000014b3), url(${__webpack_public_path__}assets/images/bg-login.webp)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />

            <div className="absolute left-16 top-12 z-20">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    aria-label="Go back"
                    className="cursor-pointer"
                >
                    <img
                        src={`${__webpack_public_path__}assets/images/arrow-back.webp`}
                        alt="Back"
                        className="h-5 w-5 object-contain"
                    />
                </button>
            </div>

            <div className="absolute left-16 bottom-12 z-20">
                <button
                    type="button"
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                    title={`Current theme: ${theme}`}
                    className="cursor-pointer"
                >
                    <img
                        src={`${__webpack_public_path__}assets/images/light.png`}
                        alt="Theme"
                        className="h-8 w-8 object-contain"
                    />
                </button>
            </div>

            {/* Main Content Container */}
            <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex flex-col md:flex-row lg:flex-row gap-12 lg:gap-2 items-center justify-between">
                        {/* Left Side: Branding */}
                        <BrandingSection />

                        {/* Right Side: KYC Card Section */}
                        <CardSection>{children}</CardSection>
                    </div>
                </div>
            </div>
        </div>
    );
};
