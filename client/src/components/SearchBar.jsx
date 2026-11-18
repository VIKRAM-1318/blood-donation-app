import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as donorService from '../services/donorService';
import * as requestService from '../services/requestService';

function SearchBar({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ donors: [], requests: [] });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const overlayRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    if (isOpen) {
      setQuery('');
      setResults({ donors: [], requests: [] });
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const search = useCallback(async (q) => {
    if (!q.trim()) {
      setResults({ donors: [], requests: [] });
      return;
    }
    setLoading(true);
    try {
      const [donorRes, requestRes] = await Promise.allSettled([
        donorService.getDonors({ search: q, limit: 5 }),
        requestService.getRequests({ search: q, limit: 5 }),
      ]);
      setResults({
        donors: donorRes.status === 'fulfilled' ? (donorRes.value.data.data || []) : [],
        requests: requestRes.status === 'fulfilled' ? (requestRes.value.data.data || []) : [],
      });
    } catch {
      setResults({ donors: [], requests: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleNavigate = (path) => {
    onClose();
    navigate(path);
  };

  if (!isOpen) return null;

  const hasResults = results.donors.length > 0 || results.requests.length > 0;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm pt-[15vh]"
    >
      <div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-gray-200 px-4 dark:border-gray-700">
          <span className="material-symbols-outlined text-gray-400">search</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search donors, blood requests..."
            className="flex-1 border-0 bg-transparent py-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 dark:text-gray-100 dark:placeholder-gray-500"
          />
          <kbd className="hidden rounded-md border border-gray-200 px-2 py-0.5 text-xs text-gray-400 sm:inline dark:border-gray-600">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-brand-600" />
            </div>
          )}

          {!loading && query && !hasResults && (
            <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              No results found for &ldquo;{query}&rdquo;
            </div>
          )}

          {!loading && hasResults && (
            <div className="py-2">
              {results.donors.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Donors
                  </div>
                  {results.donors.map((donor) => (
                    <button
                      key={donor._id}
                      onClick={() => handleNavigate('/find-donors')}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 text-sm font-bold text-[#b70011] dark:bg-red-950 dark:text-red-400">
                        {donor.bloodGroup || donor.group || 'O+'}
                      </span>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {donor.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {donor.district}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {results.requests.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Blood Requests
                  </div>
                  {results.requests.map((req) => (
                    <button
                      key={req._id}
                      onClick={() => handleNavigate('/blood-requests')}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 text-sm font-bold text-[#b70011] dark:bg-red-950 dark:text-red-400">
                        {req.bloodGroup}
                      </span>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {req.patientName}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {req.hospital} — {req.district}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {!loading && !query && (
            <div className="px-4 py-8 text-center text-sm text-gray-400 dark:text-gray-500">
              Start typing to search…
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
