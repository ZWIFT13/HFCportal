import PropertyCard from "./PropertyCard";
import { Property } from "@/types/property";

type Props = {
  data: Property[];
  onDetailClick: (id: string) => void; // ✅ ชัดเจนกว่า
};

export default function DashboardGrid({ data, onDetailClick }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {data.map((p) => (
        <PropertyCard
          key={p.id}
          property={p}
          onClick={() => onDetailClick(p.id)}
        />
      ))}
    </div>
  );
}
