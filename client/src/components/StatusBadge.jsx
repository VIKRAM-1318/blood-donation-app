const colorMaps = {
  urgency: {
    Critical: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
    Urgent: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
    Standard: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  },
  status: {
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
    'Under Coordination': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    Fulfilled: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    Cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  },
  availability: {
    Available: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    Unavailable: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
    true: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    false: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
  },
};

function StatusBadge({ status, type = 'status' }) {
  const map = colorMaps[type] || colorMaps.status;
  const displayText =
    type === 'availability'
      ? status === true || status === 'Available'
        ? 'Available'
        : 'Unavailable'
      : status;

  const colorClass = map[String(status)] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${colorClass}`}
    >
      {displayText}
    </span>
  );
}

export default StatusBadge;
