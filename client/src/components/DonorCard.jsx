import { useApp } from '../context/AppContext';

function maskPhone(phone) {
  if (!phone) return '•••• ••••';
  const digits = String(phone).replace(/\D/g, '');
  if (digits.length < 4) return '•••• ••••';
  return `•••• ••• ${digits.slice(-4)}`;
}

export default function DonorCard({ donor, onRequestContact, onViewProfile }) {
  const { isDarkMode } = useApp();

  const isAvailable =
    donor.available !== undefined
      ? donor.available
      : donor.isAvailable !== undefined
      ? donor.isAvailable
      : true;

  const bloodGroup = donor.group || donor.bloodGroup || 'O+';
  const name = donor.name || 'Anonymous Donor';
  const location = donor.location || (donor.city ? `${donor.city}, ${donor.district}` : donor.district || 'Colombo');
  const badge = donor.badge || (donor.isVerified ? 'NBTS Verified' : 'Registered Donor');
  const lastDonated = donor.lastDonated || (donor.lastDonationDate ? new Date(donor.lastDonationDate).toLocaleDateString() : 'Available');

  return (
    <div
      className={`rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between border ${
        isDarkMode
          ? 'bg-[#1E293B] border-[#334155] text-[#CBD5E1]'
          : 'bg-white border-slate-100 text-[#0b1c30]'
      }`}
    >
      <div>
        {/* Header: Name, location & Blood Group Badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ffdad6] text-[#b70011]">
                {badge}
              </span>
              {donor.isVerified && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#008438]">
                  <span className="material-symbols-outlined !text-[14px]">verified</span>
                  Verified
                </span>
              )}
            </div>
            <h3
              onClick={() => onViewProfile && onViewProfile(donor)}
              className={`text-lg font-bold truncate cursor-pointer hover:text-[#b70011] transition-colors ${
                isDarkMode ? 'text-[#F8FAFC]' : 'text-[#0b1c30]'
              }`}
            >
              {name}
            </h3>
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined !text-[16px]">location_on</span>
              <span className="truncate">{location}</span>
            </p>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-[#ffdad6] text-[#b70011] flex items-center justify-center font-bold text-xl shrink-0 shadow-sm">
            {bloodGroup}
          </div>
        </div>

        {/* Status / Availability badge */}
        <div className="flex items-center gap-2 mb-4 text-xs">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold ${
              isAvailable
                ? 'bg-[#008438]/10 text-[#008438]'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isAvailable ? 'bg-[#008438] animate-pulse' : 'bg-slate-400'
              }`}
            />
            <span>{isAvailable ? 'Ready to Donate' : 'Temporarily Inactive'}</span>
          </span>
          <span className="text-[11px] text-slate-400">Last: {lastDonated}</span>
        </div>

        {/* Masked Contact */}
        <div className="text-xs text-slate-400 flex items-center gap-1 mb-4">
          <span className="material-symbols-outlined !text-[16px]">phone</span>
          <span>{maskPhone(donor.phone)} (Privacy Protected)</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-[#334155]">
        <button
          type="button"
          onClick={() => onRequestContact && onRequestContact(donor)}
          className="flex-1 py-2 px-3 rounded-xl bg-[#dc2626] hover:bg-[#b70011] text-white font-semibold text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined !text-[16px]">send</span>
          <span>Request Contact</span>
        </button>

        <button
          type="button"
          onClick={() => onViewProfile && onViewProfile(donor)}
          className={`py-2 px-3 rounded-xl font-semibold text-xs border transition-colors flex items-center justify-center gap-1 cursor-pointer ${
            isDarkMode
              ? 'bg-[#111827] border-[#334155] text-white hover:bg-[#334155]'
              : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <span className="material-symbols-outlined !text-[16px]">person</span>
          <span>Profile</span>
        </button>
      </div>
    </div>
  );
}
