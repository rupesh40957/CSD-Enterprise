export function formatDate(date: Date | string | undefined): string {
  if (!date) return "—";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function truncateText(text: string, length = 80): string {
  if (!text) return "";
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + "...";
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

// Simple in-memory rate limiter for server route handlers
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

export function checkRateLimit(identifier: string, limit = 10, windowMs = 60000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || record.expiresAt < now) {
    rateLimitMap.set(identifier, { count: 1, expiresAt: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count += 1;
  return true;
}
