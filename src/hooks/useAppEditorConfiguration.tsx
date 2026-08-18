import { useMemo } from "react";

function useAppEditorConfiguration() {
  const formats = useMemo(
    () => ["header", "bold", "italic", "underline", "link", "image", "list", "bullet", "align", "color", "background"],
    [],
  );

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline"],
        ["link", "image"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        [{ color: [] }, { background: [] }],
        ["clean"],
      ],
    }),
    [],
  );

  return { formats, modules };
}

export default useAppEditorConfiguration;
