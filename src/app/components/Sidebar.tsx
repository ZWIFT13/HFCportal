'use client';

import { useEffect, useState } from 'react';
import Logo from '@/app/components/Logo';
import Sidebar from '@/app/components/Sidebar';
import PropertyDetailModal from '@/app/components/PropertyDetailModal';
import PropertyGrid from '@/app/components/DashboardGrid';
import Link from 'next/link';
import { Property, PropertyDetail } from '@/app/types/property';

export default function Home() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedProp, setSelectedProp] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  // For navigation in Sidebar
  const [activeMenu, setActiveMenu] = useState('home');

  useEffect(() => {
    setIsHydrated(true);
    if (localStorage.getItem('isLoggedIn') === 'true') {
      setLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch('/api/properties')
      .then(async (res) => {
        const payload = await res.json();
        if (!res.ok) throw new Error(payload.error || 'โหลดข้อมูลไม่สำเร็จ');
        if (!Array.isArray(payload)) throw new Error('ข้อมูลไม่ถูกต้อง');
        return payload as Property[];
      })
      .then(setProperties)
      .catch((err) => {
        console.error('❌ Fetch failed:', err);
        setProperties([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = properties.filter((item) => {
    const matchId = item.id.toLowerCase().includes(searchId.toLowerCase());
    const matchStatus = !selectedStatus || item.status === selectedStatus;
    const matchProp = !selectedProp || item.propertyType === selectedProp;
    const matchTeam = !selectedTeam || item.agentName === selectedTeam;
    const matchDate = selectedDate
      ? new Date(item.createdAt).toDateString() === selectedDate.toDateString()
      : true;
    return matchId && matchStatus && matchProp && matchTeam && matchDate;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const currentData = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleDetailClick = (id: string) => {
    setSelectedId(id);
    setShowDetail(true);
  };

  const handleLogin = () => {
    if (username === '' && password === '') {
      setLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true');
      setError('');
    } else {
      setError('Username หรือ Password ไม่ถูกต้อง');
    }
  };

  // Handle sidebar navigation
  const handleNavigate = (key: string) => {
    setActiveMenu(key);
    // สามารถเช็ค key แล้ว route หรือเปลี่ยนหน้าได้
    // เช่น if (key === 'add') router.push('/add') ...
  };

  if (!isHydrated) return null;

  if (!loggedIn) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-black flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-white/20 backdrop-blur-2xl rounded-2xl p-8 text-white">
          <div className="flex justify-center mb-6">
            <Logo className="h-24 w-auto" />
          </div>
          {error && <p className="text-red-400 text-center mb-4">{error}</p>}
          <div className="mb-6">
            <label className="block text-xs font-medium mb-2">USERNAME</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full h-12 rounded-full px-4 bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none"
            />
          </div>
          <div className="mb-8">
            <label className="block text-xs font-medium mb-2">PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full h-12 rounded-full px-4 bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none"
            />
          </div>
          <button
            onClick={handleLogin}
            className="block mx-auto px-8 py-2 rounded-full bg-white text-black font-semibold
            transition-all duration-200 ease-out
            hover:bg-blue-500 hover:text-white hover:shadow-xl hover:scale-105 active:scale-95
            focus:ring-2 focus:ring-blue-300"
          >
            LOG IN
          </button>
        </div>
      </main>
    );
  }

  // Layout ใหม่: Sidebar (fixed) + Main content (flex-1)
  return (
    <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-black min-h-screen flex p-10">
      {/* Sidebar */}
      <Sidebar onNavigate={handleNavigate} activeKey={activeMenu} />
      {/* Content */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">รายการทรัพย์</h2>
          <div className="flex gap-2">
            <Link
              href="/add"
              className="bg-white text-black px-4 py-2 rounded-full font-medium
              transition-all duration-200 ease-out
              hover:bg-blue-500 hover:text-white hover:shadow-xl hover:scale-105
              active:scale-95 focus:ring-2 focus:ring-blue-300"
            >
              + เพิ่มรายการ
            </Link>
            <Link
              href="/manage"
              className="bg-inherit text-white border-1 px-4 py-2 rounded-full font-medium
              transition-all duration-200 ease-out
              hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-xl hover:scale-105
              active:scale-95 focus:ring-2 focus:ring-white"
            >
              จัดการรายการ
            </Link>
          </div>
        </div>

        {/* (คุณสามารถวาง filter เพิ่มใน main ตรงนี้ได้ ถ้าอยากมี search/filter) */}

        {/* Skeleton Loading */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-44 rounded-2xl bg-white/10 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <PropertyGrid data={currentData} onDetailClick={handleDetailClick} />
        )}

        <div className="flex justify-center items-center gap-4 mt-6 text-white">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded bg-white/20 disabled:opacity-50
            transition-all duration-200
            hover:bg-blue-500 hover:text-white hover:shadow-xl hover:scale-105
            active:scale-95 focus:ring-2 focus:ring-blue-300"
          >
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded bg-white/20 disabled:opacity-50
            transition-all duration-200
            hover:bg-blue-500 hover:text-white hover:shadow-xl hover:scale-105
            active:scale-95 focus:ring-2 focus:ring-blue-300"
          >
            Next
          </button>
        </div>
      </main>

      {showDetail && selectedId && (
        <PropertyDetailModal
          property={
            (properties.find((p) => p.id === selectedId) ||
              currentData.find((p) => p.id === selectedId)) as PropertyDetail
          }
          onClose={() => setShowDetail(false)}
        />
      )}
    </div>
  );
}
