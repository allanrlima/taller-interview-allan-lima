"use client";

import { useEffect, useRef, useState } from "react";

export function useIntersectionObserver<T extends Element>(options?: IntersectionObserverInit) {
  const ref = useRef<T>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || isIntersecting) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        observer.disconnect();
      }
    }, options);

    observer.observe(element);
    return () => observer.disconnect();
  }, [isIntersecting, options]);

  return { ref, isIntersecting };
}
