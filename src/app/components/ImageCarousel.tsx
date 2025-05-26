// src/components/ImageCarousel.tsx

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

type Props = {
  images: string[];
  autoPlay?: boolean;
  autoPlayInterval?: number; // milliseconds
};

export default function ImageCarousel({
  images,
  autoPlay = true,
  autoPlayInterval = 5000,
}: Props) {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimeout = () => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    if (autoPlay && images.length > 1) {
      resetTimeout();
      timeoutRef.current = setTimeout(
        () => setCurrent((prev) => (prev + 1) % images.length),
        autoPlayInterval
      );
      return () => resetTimeout();
    }
  }, [current, autoPlay, autoPlayInterval, images.length]);

  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  const nextSlide = () => setCurrent((prev) => (prev + 1) % images.length);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl shadow-md border border-white/10 bg-white/5">
      {/* Slides */}
      <div
        className="whitespace-nowrap transition-transform duration-500"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((src, idx) => (
          <div
            key={idx}
            className="inline-block w-full h-64 md:h-80 lg:h-96 relative"
          >
            <Image
              src={src}
              alt={`ภาพ ${idx + 1}`}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ))}
      </div>

      {/* Prev / Next Buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 focus:outline-none"
          >
            ‹
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 focus:outline-none"
          >
            ›
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`w-2 h-2 rounded-full ${
                  idx === current ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
