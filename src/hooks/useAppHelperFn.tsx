import { useCallback } from "react";

function useAppHelperFn() {
  const getResourceUrl = useCallback(function (relativeUrl: string | undefined | null) {
    return relativeUrl ? `${import.meta.env.VITE_API_BASE_URL}${relativeUrl}` : "/404.jpg";
  }, []);

  const getDescriptionCount = useCallback(function (text: string) {
    const charLen = text.split("").filter((item: string) => item && item !== " " && item !== "\n").length;

    return charLen;
  }, []);

  return { getResourceUrl, getDescriptionCount };
}

export default useAppHelperFn;