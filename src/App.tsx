import React, { useState } from 'react';


// -------------------------------------
// Basic Shared Components
// -------------------------------------
const Button: React.FC<
    React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' }
> = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseStyle =
        'rounded-xl font-[500] text-sm px-5 py-2.5 transition-all font-semibold flex items-center justify-center gap-2';
    const variants = {
        primary: 'bg-[#252955] text-white hover:bg-[#1f2347]',
        secondary: 'bg-[#FFFFFF] border-[#252955] border text-[#252955] hover:bg-[#E6EBFB]',
        danger: 'bg-[#EF4444] text-white hover:bg-[#DC2626]',
    };
    return (
        <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};

// -------------------------------------
// Trusted Devices Feature
// -------------------------------------
const initialDevices = [
    {
        id: '1',
        name: 'Windows PC - Chrome',
        ip: '192.168.1.10',
        location: 'New York, USA',
        lastActive: 'Active now',
        isCurrent: true,
    },
    {
        id: '2',
        name: 'iPhone 13 - Safari',
        ip: '172.56.21.34',
        location: 'New York, USA',
        lastActive: '2 days ago',
        isCurrent: false,
    },
    {
        id: '3',
        name: 'MacBook Pro - Safari',
        ip: '198.51.100.12',
        location: 'Boston, USA',
        lastActive: '1 week ago',
        isCurrent: false,
    },
];

const TrustedDevicesPanel = () => {
    const [devices, setDevices] = useState(initialDevices);
    const [deviceToDelete, setDeviceToDelete] = useState<string | null>(null);

    const confirmDelete = () => {
        if (deviceToDelete) {
            setDevices(devices.filter((d) => d.id !== deviceToDelete));
            setDeviceToDelete(null);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in text-[#1D2939] dark:text-[#E2E8F0]">
            <div className="flex justify-between items-center border-b border-[#EAECF0] dark:border-[#3A4158] pb-2 mb-4">
                <h3 className="text-lg font-semibold">Trusted Devices</h3>
            </div>
            <p className="text-sm text-[#667085] dark:text-[#94A3B8] mb-6">
                These are the devices that have accessed your account. If you don't recognize a
                device, remove it immediately.
            </p>

            <div className="space-y-4">
                {devices.map((device) => (
                    <div
                        key={device.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-[#EAECF0] dark:border-[#3A4158] bg-white dark:bg-[#1E2530] hover:shadow-sm transition-shadow"
                    >
                        <div className="flex items-center gap-4">
                            <div className="text-2xl">
                                {device.name.includes('iPhone') ? '📱' : '💻'}
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm flex items-center gap-2">
                                    {device.name}
                                    {device.isCurrent && (
                                        <span className="bg-[#EEF2FF] text-[#252955] dark:bg-[#313567] dark:text-[#04ECB8] text-[10px] px-2 py-0.5 rounded-full">
                                            Current Device
                                        </span>
                                    )}
                                </h4>
                                <div className="text-xs text-[#667085] dark:text-[#94A3B8] flex gap-3 mt-1">
                                    <span>{device.location}</span>
                                    <span>•</span>
                                    <span>{device.lastActive}</span>
                                </div>
                            </div>
                        </div>
                        {!device.isCurrent && (
                            <button
                                onClick={() => setDeviceToDelete(device.id)}
                                className="mt-3 sm:mt-0 text-[#EF4444] hover:bg-red-50 dark:hover:bg-[#7C3A3A] p-2 rounded-lg transition-colors tooltip-trigger"
                                title="Remove Device"
                            >
                                🗑️
                            </button>
                        )}
                    </div>
                ))}

                {devices.length === 0 && (
                    <div className="text-center py-8 text-[#667085]">
                        No other trusted devices found.
                    </div>
                )}
            </div>

            {/* Simple Inline Delete Confirmation Modal */}
            {deviceToDelete && (
                <div className="!mt-0 fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#1C2130] p-6 rounded-2xl shadow-xl border border-[#EAECF0] dark:border-[#3A4158] max-w-sm w-full mx-4 animate-scale-in">
                        <h4 className="text-lg font-bold mb-2">Remove Device?</h4>
                        <p className="text-sm text-[#667085] dark:text-[#94A3B8] mb-6">
                            This device will be logged out immediately and will require a 2FA code
                            to access this account again.
                        </p>
                        <div className="flex justify-end gap-3">
                            <Button
                                variant="secondary"
                                className="min-w-[110px]"
                                onClick={() => setDeviceToDelete(null)}
                            >
                                Cancel
                            </Button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                className="min-w-[110px] rounded-xl border border-[#BE123C] bg-[#E11D48] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#BE123C]"
                                style={{
                                    color: '#FFFFFF',
                                    backgroundColor: '#E11D48',
                                    borderColor: '#BE123C',
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

import { SecurityTab } from './components/security/SecurityTab';

// -------------------------------------
// Main App Shell
// -------------------------------------
type SettingTab = 'mfa' | 'trusted_devices';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<SettingTab>('mfa');
    const [isMfaExpanded, setIsMfaExpanded] = useState(true);

    const renderContent = () => {
        switch (activeTab) {
            case 'trusted_devices':
                return <TrustedDevicesPanel />;
            case 'mfa':
                return <SecurityTab />;
            default:
                return null;
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-[#F4F7FE] dark:bg-[#151923] p-4 lg:p-8 animate-fade-in">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#1D2939] dark:text-white mb-2">Settings</h1>
                <p className="text-[#667085] dark:text-[#94A3B8] text-sm">
                    Manage your Multi-Factor Authentication and trusted devices.
                </p>
            </div>

            <div className="flex flex-col xl:flex-row gap-6 flex-1 min-h-0">
                <div className="xl:w-72 xl:shrink-0 flex flex-col gap-2">
                    <div className="bg-white dark:bg-[#1C2130] rounded-2xl shadow-sm border border-[#EAECF0] dark:border-[#2E3345] p-3 overflow-y-auto">
                        <nav className="flex flex-col space-y-1">
                            <button
                                type="button"
                                onClick={() => setIsMfaExpanded((prev) => !prev)}
                                aria-expanded={isMfaExpanded}
                                className="flex items-center justify-between w-full text-left px-4 py-3 rounded-xl transition-all duration-200 text-[#252955] dark:text-[#04ECB8] font-semibold bg-[#EEF2FF] dark:bg-[#313567]/40 border border-[#E0E7FF] dark:border-[#4A5578]/50"
                            >
                                <span className="flex items-center gap-3">
                                    <span className="text-lg">🔐</span>
                                    <span className="text-sm">Multi Factor Authentication</span>
                                </span>
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`transition-transform duration-200 ${
                                        isMfaExpanded ? 'rotate-180' : ''
                                    }`}
                                >
                                    <path
                                        d="M6 9L12 15L18 9"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>

                            {isMfaExpanded && (
                                <div className="pl-4 pt-1 space-y-1">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('mfa')}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                            activeTab === 'mfa'
                                                ? 'bg-[#EEF2FF] dark:bg-[#313567]/40 text-[#252955] dark:text-[#04ECB8]'
                                                : 'text-[#667085] dark:text-[#94A3B8] hover:bg-[#F9FAFB] dark:hover:bg-[#2A2E3A]'
                                        }`}
                                    >
                                        Recovery Codes
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('trusted_devices')}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                            activeTab === 'trusted_devices'
                                                ? 'bg-[#EEF2FF] dark:bg-[#313567]/40 text-[#252955] dark:text-[#04ECB8]'
                                                : 'text-[#667085] dark:text-[#94A3B8] hover:bg-[#F9FAFB] dark:hover:bg-[#2A2E3A]'
                                        }`}
                                    >
                                        Trusted Devices
                                    </button>
                                </div>
                            )}
                        </nav>
                    </div>
                </div>

                <div className="flex-1 bg-white dark:bg-[#1C2130] rounded-2xl shadow-sm border border-[#EAECF0] dark:border-[#2E3345] p-6 lg:p-8 overflow-y-auto">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default App;
