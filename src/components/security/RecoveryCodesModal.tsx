import React, { useState } from 'react';
import { Modal, Checkbox } from 'customMain/components';

interface RecoveryCodesModalProps {
    isOpen: boolean;
    codes: string[];
    onClose: () => void;
}

export const RecoveryCodesModal: React.FC<RecoveryCodesModalProps> = ({
    isOpen,
    codes,
    onClose,
}) => {
    const [copied, setCopied] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    if (!isOpen || codes.length === 0) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(codes.join('\n'));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handlePrint = () => {
        const printContent = [
            'Recovery Authentication Codes',
            '',
            'These recovery codes wont appear again after leaving this page.',
            'Make sure to print, download, or copy them and keep them safe.',
            '',
            ...codes.map((code, idx) => {
                const normalizedCode = code.replace(/^\d{1,2}-/, '');
                return `${idx + 1}: ${normalizedCode}`;
            }),
        ].join('\n');

        const popup = window.open('', '_blank', 'width=900,height=700');
        if (!popup) return;

        const popupDocument = popup.document;
        popupDocument.title = 'Recovery Authentication Codes';

        const style = popupDocument.createElement('style');
        style.textContent = `
            body { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; padding: 48px; color: #111827; }
            h1 { margin: 0 0 16px; font-size: 24px; font-weight: 600; border-bottom: 1px solid #eee; padding-bottom: 16px; }
            pre { white-space: pre-wrap; line-height: 1.8; font-size: 16px; font-family: monospace; }
        `;
        popupDocument.head.appendChild(style);

        const heading = popupDocument.createElement('h1');
        heading.textContent = 'Recovery Authentication Codes';
        popupDocument.body.appendChild(heading);

        const pre = popupDocument.createElement('pre');
        pre.textContent = printContent;
        popupDocument.body.appendChild(pre);

        popup.focus();
        popup.print();
    };

    const handleDownload = () => {
        const textContent = `Recovery Codes\n\nKeep these secure. Each code can only be used once.\n\n${codes.join('\n')}`;
        const blob = new Blob([textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'recovery-codes.txt';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    };

    const handleClose = () => {
        onClose();
        setCopied(false);
        setIsSaved(false);
    };

    const formattedCodes = codes.map((code, idx) => ({
        index: idx + 1,
        value: code.replace(/^\d{1,2}-/, ''),
    }));

    const leftCodes = formattedCodes.slice(0, Math.ceil(formattedCodes.length / 2));
    const rightCodes = formattedCodes.slice(Math.ceil(formattedCodes.length / 2));

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Recovery Authentication Codes"
            size="lg"
            hideCloseIcon={true}
            disableCloseOnOverlayClick={true}
            footer={
                <div className="w-full flex justify-end ">
                    <button
                        onClick={handleClose}
                        disabled={!isSaved}
                        className={`px-8 py-3 rounded-lg text-[16px] transition-all shadow-md ${isSaved
                            ? 'bg-[#252A56] text-white hover:bg-[#252A56]'
                            : 'bg-[#EAECF0] text-[#98A2B3] cursor-not-allowed'
                            }`}
                    >
                        Complete setup
                    </button>
                </div>
            }
        >
            <div className="space-y-6 py-4 px-6">
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg flex gap-4">
                    <span className="text-3xl pt-1 flex items-center justify-center">⚠️</span>
                    <div className="space-y-3">
                        <h3 className="text-base font-bold text-amber-900 leading-tight">
                            These recovery codes wont appear again after leaving this page
                        </h3>
                        <p className="text-sm text-amber-800 leading-[1.5]">
                            Make sure to print, download, or copy them to a password manager and
                            keep them save. Canceling this setup will remove these recovery codes
                            from your account.
                        </p>
                    </div>
                </div>

                {/* Codes Grid */}
                <div className="px-2">
                    <div className="grid grid-cols-2 gap-x-12 text-[18px] text-[#1F2937]">
                        <div className="space-y-3">
                            {leftCodes.map((code) => (
                                <div key={`left-${code.index}`} className="flex">
                                    <span className="text-xs font-bold">
                                        <span className="mr-5 inline-block">{code.index}:</span>
                                        <span className="inline-block ml-3">{code.value}</span>
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-3">
                            {rightCodes.map((code) => (
                                <div key={`right-${code.index}`} className="flex">
                                    <span className="text-xs font-bold">
                                        <span className="mr-5 inline-block">{code.index}:</span>
                                        <span className="inline-block ml-3">{code.value}</span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Action Links */}
                <div className="flex items-center gap-1 text-[#1570EF]">
                    <button
                        onClick={handlePrint}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors group relative"
                        title="Print"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 6 2 18 2 18 9"></polyline>
                            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                            <rect x="6" y="14" width="12" height="8"></rect>
                        </svg>
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Print</span>
                    </button>

                    <button
                        onClick={handleDownload}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors group relative"
                        title="Download"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Download</span>
                    </button>

                    <button
                        onClick={handleCopy}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors group relative"
                        title="Copy"
                    >
                        {copied ? (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                        )}
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {copied ? 'Copied!' : 'Copy'}
                        </span>
                    </button>
                </div>

                {/* Checkbox */}
                <label className="flex items-center gap-3 cursor-pointer group ">
                    <Checkbox
                        checked={isSaved}
                        onChange={setIsSaved}
                        className="w-4 h-4"
                    />
                    <span className="text-sm text-[#4B5563] group-hover:text-[#1F2937] transition-colors">
                        I have saved these codes somewhere safe
                    </span>
                </label>
            </div>
        </Modal>
    );
};
