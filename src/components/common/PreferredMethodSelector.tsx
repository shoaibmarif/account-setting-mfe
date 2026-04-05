import { useEffect, useState } from 'react';
import { Checkbox } from 'customMain/components';
import { authService } from '../../services/auth.service';

export type DeliveryMethodOption = {
    value: string;
    label: string;
};

interface PreferredMethodSelectorProps {
    selectedMethod: string;
    onSelect: (value: string) => void;
    error?: string | undefined;
}

const mapOptions = (raw: any[]): DeliveryMethodOption[] =>
    raw.map((item: any, idx: number) => ({
        value: String(
            item?.value ?? item?.methodId ?? item?.id ?? item?.otpPreferenceMethodId ?? idx + 1,
        ),
        label: String(
            item?.label ?? item?.methodName ?? item?.name ?? item?.title ?? `Method ${idx + 1}`,
        ),
    }));

const PreferredMethodSelector: React.FC<PreferredMethodSelectorProps> = ({
    selectedMethod,
    onSelect,
    error,
}) => {
    const [methodOptions, setMethodOptions] = useState<DeliveryMethodOption[]>([]);

    const fetchOTPPreferenceMethods = async () => {
        try {
            const res = await authService.getOTPPreferenceMethod();
            const raw = res?.data?.data ?? res?.data;
            if (Array.isArray(raw) && raw.length > 0) {
                setMethodOptions(mapOptions(raw));
            }
        } catch (_error) {
            console.error('Failed to fetch OTP preference methods', _error);
            // API error handled by global interceptor
        }
    };

    useEffect(() => {
        fetchOTPPreferenceMethods();
    }, []);

    return (
        <div className="space-y-2">
            <h4 className="text-center text-[25px] leading-8 font-semibold text-primary">
                Preferred Method
            </h4>
            <p className="text-center text-[12px] text-[#9A9A9A]">
                Choose your preferred method for receiving one-time passwords
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
                {methodOptions.map((method) => (
                    <label
                        key={method.value}
                        className="flex items-center gap-2.5 text-[13px] leading-4 text-[#9A9A9A]"
                    >
                        <Checkbox
                            checked={selectedMethod === method.value}
                            onChange={() => onSelect(method.value)}
                            className="h-4 w-4"
                        />
                        <span className="whitespace-nowrap">{`${method.label}`}</span>
                    </label>
                ))}
            </div>
            {error && <p className="text-center text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
};

export default PreferredMethodSelector;
