import { useApp } from '../context/AppContext';

export default function RequestCard({ request, onFulfill }) {
  const { isDarkMode } = useApp();

  const patient = request.patientName || request.patient || 'Anonymous Patient';
  const bloodGroup = request.bloodGroup || 'O+';
  const hospital = request.hospitalName || request.hospital || 'General Hospital';
  const district = request.district || request.city || 'Colombo';
  const units = request.unitsNeeded || request.units || 1;
  const urgency = request.urgency || 'Standard';
  const status = request.status || 'Pending';

  const isUrgent = urgency.toLowerCase().includes('crit') || urgency.toLowerCase().includes('urg');
  const isFulfilled = status.toLowerCase() === 'fulfilled';

  return (
    <div
      className={`rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between border ${
        isDarkMode
          ? 'bg-[#1E293B] border-[#334155] text-[#CBD5E1]'
          : 'bg-white border-slate-100 text-[#0b1c30]'
      }`}
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
              isUrgent
                ? 'bg-[#ffdad6] text-[#b70011]'
                : 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
            }`}
          >
            {isUrgent && <span className="w-2 h-2 rounded-full bg-[#b70011] animate-ping" />}
            <span>{urgency}</span>
          </span>

          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
              isFulfilled
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
            }`}
          >
            {status}
          </span>
        </div>

        {/* Patient Name & Blood Group */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3
              className={`text-lg font-bold truncate ${
                isDarkMode ? 'text-[#F8FAFC]' : 'text-[#0b1c30]'
              }`}
            >
              {patient}
            </h3>
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined !text-[16px]">local_hospital</span>
              <span className="truncate">{hospital}</span>
            </p>
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined !text-[16px]">location_on</span>
              <span className="truncate">{district}</span>
            </p>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-[#ffdad6] text-[#b70011] flex items-center justify-center font-bold text-xl shrink-0 shadow-sm">
            {bloodGroup}
          </div>
        </div>

        {/* Units required */}
        <div className="flex items-center justify-between py-2 border-t border-slate-100 dark:border-[#334155] text-xs">
          <span className="text-slate-400">Required:</span>
          <span className="font-bold text-[#b70011]">
            {units} {units === 1 ? 'Unit' : 'Units'} needed
          </span>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-3 border-t border-slate-100 dark:border-[#334155] mt-3">
        {isFulfilled ? (
          <div className="py-2.5 px-4 rounded-xl bg-emerald-500/10 text-[#008438] text-xs font-semibold text-center flex items-center justify-center gap-1.5">
            <span className="material-symbols-outlined !text-[18px]">task_alt</span>
            <span>Fulfilled</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onFulfill && onFulfill(request)}
            className="w-full py-2.5 px-4 rounded-xl bg-[#dc2626] hover:bg-[#b70011] text-white font-semibold text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined !text-[16px]">favorite</span>
            <span>I Can Donate</span>
          </button>
        )}
      </div>
    </div>
  );
}
