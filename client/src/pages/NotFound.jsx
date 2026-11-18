import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useApp } from '../context/AppContext';

export default function NotFound() {
  const { isDarkMode } = useApp();

  return (
    <div
      className={`w-full min-h-screen flex flex-col justify-between transition-colors ${
        isDarkMode ? 'bg-[#0F172A] text-[#F8FAFC]' : 'bg-[#f8f9ff] text-[#0b1c30]'
      }`}
    >
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-[#ffdad6] text-[#b70011] flex items-center justify-center mb-6">
          <span className="material-symbols-outlined !text-[40px]">error_outline</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">404 - Page Not Found</h1>
        <p className={`text-sm sm:text-base max-w-md mb-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          The page you are looking for might have been moved, removed, or doesn't exist on the LifeLink portal.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/"
            className="px-6 py-3 rounded-xl bg-[#dc2626] hover:bg-[#b70011] text-white font-semibold text-sm shadow-md transition-all inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined !text-[20px]">home</span>
            <span>Back to Home</span>
          </Link>
          <Link
            to="/find-donors"
            className={`px-6 py-3 rounded-xl font-semibold text-sm border transition-all inline-flex items-center gap-2 ${
              isDarkMode
                ? 'bg-[#1E293B] border-[#334155] text-white hover:bg-[#334155]'
                : 'bg-white border-slate-200 text-[#0b1c30] hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined !text-[20px] text-[#b70011]">search</span>
            <span>Find Donors</span>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
