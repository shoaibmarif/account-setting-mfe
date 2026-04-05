import { Checkbox } from 'customMain/components';

interface RegisterDeviceCheckboxProps {
    checked: boolean;
    onChange: (value: boolean) => void;
    helperText: string;
}

const RegisterDeviceCheckbox: React.FC<RegisterDeviceCheckboxProps> = ({
    checked,
    onChange,
    helperText,
}) => {
    return (
        <label className="mx-auto flex max-w-xl items-start gap-3 rounded-md border border-[#E5E7EF] px-4 py-3.5 cursor-pointer">
            <Checkbox checked={checked} onChange={onChange} className="mt-0.5 h-5 w-5" />
            <span className="flex flex-col gap-1">
                <span className="text-[15px] leading-5 font-medium text-[#1E213E]">
                    Register this device as Trusted?
                </span>
                <span className="text-[11px] leading-4 text-[#9A9A9A]">{helperText}</span>
            </span>
        </label>
    );
};

export default RegisterDeviceCheckbox;
