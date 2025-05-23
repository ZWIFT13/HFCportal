// src/app/components/PropertyTableRow.tsx

import { Property } from "@/types/property";
import Link from "next/link";

type Props = {
  property: Property;
};

// ถ้าต้องการ province จริงๆ ควรเพิ่ม field ใน Property แต่ตอนนี้ยังใช้ ownerName แยกชั่วคราว
export default function PropertyTableRow({ property }: Props) {
  const province = property.ownerName.includes("ลำลูกกา")
    ? "ปทุมธานี"
    : property.ownerName.includes("รังสิต")
    ? "ปทุมธานี"
    : "ไม่ทราบจังหวัด";

  return (
    <tr className="hover:bg-gray-50 text-sm text-black">
      <td className="px-4 py-2 font-mono text-blue-600">
        {property.id}
      </td>
      <td className="px-4 py-2">
        {property.ownerName}
      </td>
      <td className="px-4 py-2">
        {/* ถ้า locationLink เป็น null จะ fallback เป็น undefined ซึ่ง TypeScript ยอม */}
        <a
          href={property.locationLink ?? undefined}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          {province}
        </a>
      </td>
      <td className="px-4 py-2">
        {property.status}
      </td>
      <td className="px-4 py-2 text-right">
        <Link href={`/property/${property.id}`}>
          <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            ดูรายละเอียด
          </button>
        </Link>
      </td>
    </tr>
  );
}
