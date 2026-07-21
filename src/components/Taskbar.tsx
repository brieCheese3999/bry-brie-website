import React, { useEffect, useState } from 'react';

function formatTime(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  let hours = date.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${pad(hours)}:${pad(date.getMinutes())} ${ampm}`;
}

export const Taskbar: React.FC = () => {
  const [time, setTime] = useState<string>(() => formatTime(new Date()));

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime(new Date())), 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="win95-desktop-taskbar win95-raised">
      <div className="win95-start-btn win95-raised">
        <div className="win95-start-flag">
          <span />
          <span />
          <span />
          <span />
        </div>
        Start
      </div>
      <div className="win95-taskbar-clock">{time}</div>
    </div>
  );
};
