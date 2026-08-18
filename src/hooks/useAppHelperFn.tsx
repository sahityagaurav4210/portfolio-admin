import { useCallback } from "react";

function useAppHelperFn() {
  const getResourceUrl = useCallback(function (relativeUrl: string | undefined | null) {
    return relativeUrl ? `${import.meta.env.VITE_API_BASE_URL}${relativeUrl}` : "/404.jpg";
  }, []);

  const getDescriptionCount = useCallback(function (text: string) {
    const charLen = text.split("").filter((item: string) => item && item !== " " && item !== "\n").length;

    return charLen;
  }, []);

  const getCookieValue = useCallback(function (name: string): string | null {
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(`${name}=`)) {
        return cookie.substring(name.length + 1);
      }
    }

    return null;
  }, []);

  const getSafeFormDataPayload = useCallback(function (payload: Record<string, any>): FormData {
    const entries = Object.entries(payload);
    const processedPayload = new FormData();

    for (const e of entries) {
      if (e[1]) processedPayload.append(e[0], e[1]);
      if (e[1] === "") processedPayload.append(e[0], "");
    }

    return processedPayload;
  }, []);

  return { getResourceUrl, getDescriptionCount, getCookieValue, getSafeFormDataPayload };
}

export default useAppHelperFn;
