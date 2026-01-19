import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';

const NotificationBell = ({ onClick }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch(`${API_URL}/notifications/count`);
        const data = await res.json();
        if (data.success) setCount(data.count);
      } catch(e) {}
    };
    
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <button onClick={onClick} className="relative p-2 text-white hover:bg-orange-700 rounded-lg">
      <span className="text-xl">🔔</span>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  );
};

export default NotificationBell;
