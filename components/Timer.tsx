import { TypeOptions } from '@/app/page';
import { useState, useEffect } from 'react';

interface Props {
  running: boolean;
  type: TypeOptions;
  restartKey: number;
}

const Timer = ({ running, type, restartKey }: Props) => {
  const [seconds, setSeconds] = useState<number>(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (running) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [running]);

  useEffect(() => {
    if (restartKey) {
      setSeconds(0);
    }
  }, [restartKey]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
  }

  return (
    <p className={`${type === 'vectorize' ? 'green-text': 'red-text'} dark-bg px-4`}>{formatTime(seconds)}</p>
  );
}

export default Timer;
