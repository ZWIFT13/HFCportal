// src/app/components/Logo.tsx

import Image from "next/image";

export type LogoProps = {
  className?: string;
};

export default function Logo({ className = "" }: LogoProps) {
  return (
    <div className={className}>
      <Image
        src="/home_for_cash_logo.webp"
        alt="Home For Cash Logo"
        width={200}
        height={64}
        priority
      />
    </div>
  );
}
