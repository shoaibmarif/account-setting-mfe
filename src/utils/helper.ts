export const isSuccessfulResponse = (response: any) =>
    Boolean(response?.success || response?.data?.success);

export const shouldShowLocalError = (response: any) =>
    Boolean(response?.success === false && response?.message && !response?.status);

export const shouldStopOnApiFailure = (
    response: any,
    onError?: (message: string) => void,
) => {
    if (isSuccessfulResponse(response)) {
        return false;
    }

    if (shouldShowLocalError(response) && typeof response?.message === 'string') {
        onError?.(response.message);
    }

    return true;
};