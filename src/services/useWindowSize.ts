import { useLayoutEffect, useState } from 'react';

const useWindowSize = () => {
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

  useLayoutEffect(() => {
    function updateSize() {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    }

    const visualViewport = (window as any).visualViewport;

    window.addEventListener('resize', updateSize);
    window.addEventListener('orientationchange', updateSize);
    visualViewport?.addEventListener('resize', updateSize);

    updateSize();

    // home-screen (standalone) launches on iOS report a stale innerHeight until the web view
    // settles and never fire a window resize for it, which leaves a dead gap where the browser
    // bar used to be - re-measure a few times after launch to catch the real height
    const settleTimers = [100, 500, 1500].map((ms) => setTimeout(updateSize, ms));

    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('orientationchange', updateSize);
      visualViewport?.removeEventListener('resize', updateSize);

      for (const timer of settleTimers) {
        clearTimeout(timer);
      }
    };
  }, []);

  return [width, height];
};

export default useWindowSize;
