import { useMemo } from 'react';

function useAppCss() {
  const RequiredFieldCss = useMemo(() => ({
    "& .MuiInputLabel-asterisk": {
      color: 'red',
    }
  }), []);

  const FlexCss = useMemo(() => ({
    display: "flex",
  }), []);

  const AlignItemsCss = useMemo(() => ({ alignItems: "center" }), []);
  const JustifyItemsEndCss = useMemo(() => ({ justifyContent: "flex-end" }), []);

  return { RequiredFieldCss, FlexCss, AlignItemsCss, JustifyItemsEndCss };
}

export default useAppCss;