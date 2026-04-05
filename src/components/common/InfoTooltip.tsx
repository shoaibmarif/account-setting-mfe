import React, { useId } from 'react';
import { Tooltip } from 'react-tooltip';
import { InfoCircleIcon } from '../icons/FormIcons';
import {
    INFO_TOOLTIP_BORDER,
    INFO_TOOLTIP_STYLE,
    INFO_TOOLTIP_TRIGGER_CLASS_NAME,
    KYC_FIELD_ICON_CLASS_NAME,
} from '../../utils/constants/kycVerification.constants';

interface InfoTooltipProps {
    text: string;
    contentIcon?: React.ReactNode;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ text, contentIcon }) => {
    const uid = useId();
    const tooltipId = `info-tooltip-${uid.replaceAll(':', '')}`;

    return (
        <>
            <button
                type="button"
                data-tooltip-id={tooltipId}
                className={INFO_TOOLTIP_TRIGGER_CLASS_NAME}
            >
                <InfoCircleIcon className={KYC_FIELD_ICON_CLASS_NAME} />
            </button>
            <Tooltip
                id={tooltipId}
                place="top"
                positionStrategy="fixed"
                border={INFO_TOOLTIP_BORDER}
                opacity={1}
                style={INFO_TOOLTIP_STYLE}
                render={() => (
                    <div>
                        {contentIcon ? (
                            <div className="flex items-start gap-3">
                                <span className="mt-0.5 shrink-0 text-[#062E92] dark:text-[#04ECB8]">
                                    {contentIcon}
                                </span>
                                <p className="text-xs leading-[1.25rem] text-[#252955]">{text}</p>
                            </div>
                        ) : (
                            <p className="text-xs leading-[1.25rem] text-[#252955]">{text}</p>
                        )}
                    </div>
                )}
            />
        </>
    );
};

export default InfoTooltip;
