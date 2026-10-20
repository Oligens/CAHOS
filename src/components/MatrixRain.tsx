import { useEffect, useState } from 'react';

export default function MatrixRain() {
  const [columns, setColumns] = useState<{ chars: string[]; speed: number; x: number }[]>([]);

  useEffect(() => {
    const chars = '01アイウエオカキクケコサシスセソタチツテト∑∏∫∂√∞≈≠±×÷';
    const numCols = Math.floor(window.innerWidth / 20);
    const cols = Array.from({ length: numCols }, () => ({
      chars: Array.from({ length: 20 }, () => chars[Math.floor(Math.random() * chars.length)]),
      speed: 0.5 + Math.random() * 2,
      x: Math.random() * 100,
    }));
    setColumns(cols);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-10">
      {columns.map((col, i) => (
        <div
          key={i}
          className="absolute top-0 text-xs font-mono text-cyan-400"
          style={{
            left: `${col.x}%`,
            animation: `matrix-rain ${5 / col.speed}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        >
          {col.chars.map((char, j) => (
            <div key={j} className="opacity-50" style={{ opacity: 1 - j * 0.05 }}>
              {char}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
