import { useCallback, useState } from "react";

const useImageLightbox = () => {
  const [state, setState] = useState({ opened: false, index: 0 });

  const open = useCallback(
    (index = 0) => setState({ opened: true, index }),
    [],
  );

  const close = useCallback(
    () => setState((s) => ({ ...s, opened: false })),
    [],
  );

  return { opened: state.opened, initialIndex: state.index, open, close };
};

export default useImageLightbox;
