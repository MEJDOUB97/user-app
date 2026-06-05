export function formatDate(value) {
  if (!value) {
    return 'No date';
  }

  return new Intl.DateTimeFormat('en-MA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

export function formatRelativeDate(value) {
  if (!value) {
    return 'Just now';
  }

  const now = new Date();
  const target = new Date(value);
  const diffDays = Math.round((target - now) / (1000 * 60 * 60 * 24));
  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  if (Math.abs(diffDays) >= 1) {
    return formatter.format(diffDays, 'day');
  }

  const diffHours = Math.round((target - now) / (1000 * 60 * 60));
  if (Math.abs(diffHours) >= 1) {
    return formatter.format(diffHours, 'hour');
  }

  const diffMinutes = Math.round((target - now) / (1000 * 60));
  return formatter.format(diffMinutes, 'minute');
}
