import { useEffect, useState } from 'react';
import { Frame } from '@react95/core/Frame';

const formatTime = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

export const PortfolioClock = () => {
  const [time, setTime] = useState(formatTime);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const update = () => {
      setTime(formatTime());
      timer = setTimeout(update, 60000 - Date.now() % 60000);
    };
    timer = setTimeout(update, 60000 - Date.now() % 60000);
    const sync = () => {
      if (document.visibilityState === 'visible') {
        clearTimeout(timer);
        update();
      }
    };
    document.addEventListener('visibilitychange', sync);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);
  return <Frame boxShadow="$in" px="$6" py="$2" display="flex" justifyContent="center" alignItems="center"><time aria-label={`Current time ${time}`}>{time}</time></Frame>;
};

export { PortfolioClock as Clock };
