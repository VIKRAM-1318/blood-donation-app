import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Footer() {
  const { isDarkMode } = useApp();
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`border-t transition-colors ${
        isDarkMode
          ? 'bg-[#0B132B] border-[#1E293B] text-slate-400'
          : 'bg-white border-slate-200 text-slate-600'
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#dc2626] text-white flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined !text-[20px]">cardiology</span>
              </div>
              <span className="text-lg font-bold tracking-tight">
                Life<span className="text-[#dc2626]">Link</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed">
              Nationwide emergency blood transfusion coordination system designed for Sri Lanka's 25 districts.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/find-donors" className="hover:text-[#dc2626] transition-colors">
                  Find Blood Donors
                </Link>
              </li>
              <li>
                <Link to="/blood-requests" className="hover:text-[#dc2626] transition-colors">
                  Emergency Requests
                </Link>
              </li>
              <li>
                <Link to="/create-request" className="hover:text-[#dc2626] transition-colors">
                  Request Blood
                </Link>
              </li>
            </ul>
          </div>

          {/* Guidelines */}
          <div>
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Standards & Safety
            </h4>
            <ul className="space-y-2 text-xs">
              <li>NBTS Transfusion Guidelines</li>
              <li>SLMC Regulatory Compliance</li>
              <li>Donor Privacy & Contact Masking</li>
              <li>Clinical Rest Interval Rules</li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Emergency Hotline
            </h4>
            <p className="text-xs leading-relaxed mb-2">
              For urgent hospital blood bank coordination:
            </p>
            <div className="text-sm font-bold text-[#dc2626]">
              +94 (11) 269 1111 (NBTS)
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Available 24/7 across all island districts
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-100 dark:border-[#1E293B] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>&copy; {currentYear} LifeLink Transfusion Network. All rights reserved.</p>
          <p className="text-[11px] text-slate-400">
            LifeLink is a coordination platform and does not replace professional clinical procedures.
          </p>
        </div>
      </div>
    </footer>
  );
}
