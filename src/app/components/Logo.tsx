import Image from 'next/image';

/**
 * Logo Component
 * - ใช้ไฟล์ logo จาก public directory
 * - ใช้ next/image optimize
 */
export default function Logo() {
  return (
    <div className="inline-block w-[100px] h-auto p-2">
      <Image
        src="/logo.webp"
        alt="HOME for Cash บ้านแลกเงิน"
        width={100}
        height={40}
        priority
        quality={80}
        placeholder="empty"
        className="object-contain"
      />
    </div>
  );
}  

/**
 * Ensure logo file `home_for_cash_logo.webp` is placed directly under the `public/` folder.
 * No need to import from public; reference with a leading slash.
 */