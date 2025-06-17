import React, { useEffect, useRef } from "react";

interface ProgressProps {
  oi?: number;
  maxOi: number;
  classCss?: {
    outer: string;
    inner: string;
  };
}

const Progress: React.FC<ProgressProps> = ({ oi, maxOi, classCss }) => {
  const prevOiRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (oi !== undefined) {
      prevOiRef.current = oi;
    }
  }, [oi]);

  const effectiveOi = oi ?? prevOiRef.current ?? 0;
  const widthPercentage = maxOi > 0 ? ((effectiveOi / maxOi) * 100) : 0;
  const clampedWidth = Math.min(Math.max(widthPercentage, 0), 100);

  return (
    <div className={`w-[45%] h-[10%] overflow-hidden  bottom-4 ${classCss?.outer || ''}`}>
      <div
        className={`h-full transition-all duration-300 ease-out ${classCss?.inner || ''}`}
        style={{ width: `${clampedWidth}%` }}
      />
    </div>
  );
};

export default React.memo(Progress);