import React, { useState } from 'react';
import { recoveryCodesService } from '../services/recoveryCodes.service';

export const LoginRecoveryScreen: React.FC = () => {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!code.trim()) {
            setError('Please enter a recovery code.');
            return;
        }

        try {
            setLoading(true);
            setError('');
            // The service checks if it's a valid code and if it's already used
            await recoveryCodesService.verifyAndBurn(code.trim());
            setSuccess(true);
            
            // In a real app, you would dispatch a REDUX action, update context, 
            // or redirect to the dashboard here.
            setTimeout(() => {
                console.log('Login successful! Redirecting to dashboard...');
                // window.location.href = '/dashboard';
            }, 1000);
            
        } catch (err) {
            const error = err as Error;
            setError(error.message || 'Invalid or incorrect sequence recovery code');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F4F7FE] dark:bg-[#151923] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#1E2530] w-full max-w-md rounded-2xl shadow-sm border border-[#EAECF0] dark:border-[#3A4158] p-8 animate-fade-in">
                
                <div className="mx-auto w-12 h-12 bg-[#EEF2FF] dark:bg-[#313567]/30 text-[#252955] dark:text-[#04ECB8] rounded-full flex items-center justify-center text-xl mb-6 shadow-sm">
                    🔐
                </div>

                <h2 className="text-2xl font-bold text-center text-[#1D2939] dark:text-white mb-2">
                    Enter Recovery Code
                </h2>
                <p className="text-sm text-center text-[#667085] dark:text-[#94A3B8] mb-8">
                    Since you cannot access your authenticator device, please enter one of your 12 recovery codes to sign in.
                </p>

                {success ? (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 p-4 rounded-xl flex items-center gap-3">
                        <span className="text-xl">✅</span>
                        <div>
                            <h4 className="font-semibold text-sm">Code Verified</h4>
                            <p className="text-xs mt-0.5">Redirecting you securely...</p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="recovery-code" className="block text-sm font-medium text-[#1D2939] dark:text-[#E2E8F0] mb-2">
                                Recovery Code
                            </label>
                            <input
                                id="recovery-code"
                                type="text"
                                value={code}
                                onChange={(e) => {
                                    setCode(e.target.value);
                                    if (error) setError('');
                                }}
                                placeholder="e.g. 05-ABCD-EFGH"
                                className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-[#151923] text-[#1D2939] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#252955] dark:focus:ring-[#04ECB8] transition-shadow font-mono ${
                                    error 
                                        ? 'border-red-500 focus:ring-red-500' 
                                        : 'border-[#EAECF0] dark:border-[#3A4158]'
                                }`}
                                disabled={loading}
                            />
                            {error && (
                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                    {error}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center rounded-xl bg-[#252955] dark:bg-[#04ECB8] disabled:opacity-50 px-5 py-3 text-sm font-semibold text-white dark:text-[#1D2939] hover:opacity-90 transition-all shadow-sm"
                        >
                            {loading ? 'Verifying...' : 'Verify and Sign In'}
                        </button>
                    </form>
                )}

                <div className="mt-8 pt-6 border-t border-[#EAECF0] dark:border-[#3A4158] text-center">
                    <p className="text-sm text-[#667085] dark:text-[#94A3B8]">
                        Found your authenticator device?
                    </p>
                    <button 
                        type="button"
                        onClick={() => console.log("Redirecting back to OTP screen...")}
                        className="mt-2 text-sm font-semibold text-[#252955] dark:text-[#04ECB8] hover:underline"
                    >
                        Return to standard OTP login
                    </button>
                </div>
            </div>
        </div>
    );
};
