import { Property } from "@/types/property";

type Props = {
  data: Property[];
  onDetailClick: (id: string) => void;
};

export default function PropertyTable({ data, onDetailClick }: Props) {
  return (
    <div className="overflow-auto shadow rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 text-gray-700 text-left text-sm font-semibold">
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">ชื่อทรัพย์</th>
            <th className="px-4 py-2">สถานที่</th>
            <th className="px-4 py-2">สถานะ</th>
            <th className="px-4 py-2 text-center"> </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-black">
          {data.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50 text-sm text-black">
              <td className="px-4 py-2 font-mono text-blue-600">{p.id}</td>
              <td className="px-4 py-2">{p.ownerName}</td>
              <td className="px-4 py-2">
                {p.locationLink ? (
                  <a
                    href={p.locationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {p.province}
                  </a>
                ) : (
                  <span className="text-gray-500">{p.province}</span>
                )}
              </td>
              <td className="px-4 py-2">{p.status}</td>
              <td className="px-4 py-2 text-right">
                <button
                  onClick={() => onDetailClick(p.id)}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  ดูรายละเอียด
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}