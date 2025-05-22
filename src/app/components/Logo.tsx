// src/app/components/Logo.tsx
import Image from "next/image";

export type LogoProps = {
  /** Tailwind classes to adjust size/spacing */
  className?: string;
};

export default function Logo({ className = "" }: LogoProps) {
  return (
    <Image
      src="/logo.webp"
      alt="HOME for Cash บ้านแลกเงิน"
      width={200}
      height={64}
      priority
      quality={80}
      placeholder="empty"
      className={`object-contain ${className}`}
    />
  );
}
