import { Property } from "@/types/property";
import Link from "next/link";

type Props = {
  property: Property;
};

// ⚠️ สมมุติว่า locationLink เป็นลิงก์ Google Maps และจังหวัดถูก embed อยู่ใน ownerName หรือ property อื่น
// ถ้ายังไม่มี field จังหวัดแยก ให้คุณเพิ่ม field "province" ใน Property แล้วใช้แทน

export default function PropertyTableRow({ property }: Props) {
  // 🧠 สมมุติว่าเราจะแยกจังหวัดจาก ownerName ชั่วคราว
  // ในระบบจริงควรแยก field ชื่อจังหวัดให้ชัดเจน
  const province = property.ownerName.includes("ลำลูกกา")
    ? "ปทุมธานี"
    : property.ownerName.includes("รังสิต")
    ? "ปทุมธานี"
    : "ไม่ทราบจังหวัด";

  return (
    <tr className="hover:bg-gray-50 text-sm text-black">
      <td className="px-4 py-2 font-mono text-blue-600">{property.id}</td>
      <td className="px-4 py-2">{property.ownerName}</td>
      <td className="px-4 py-2">
        <a
          href={property.locationLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          {province}
        </a>
      </td>
      <td className="px-4 py-2">{property.status}</td>
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
