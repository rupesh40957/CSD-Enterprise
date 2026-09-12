import fs from "fs";
import path from "path";
import { Inquiry } from "@/models/Inquiry";
import { Subscriber } from "@/models/Subscriber";

const DATA_DIR = path.join(process.cwd(), "data");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Inquiries Local Buffer
export function saveLocalInquiry(inquiry: Inquiry): Inquiry {
  ensureDir();
  const file = path.join(DATA_DIR, "inquiries_buffer.json");
  let items: Inquiry[] = [];
  if (fs.existsSync(file)) {
    try {
      items = JSON.parse(fs.readFileSync(file, "utf-8"));
    } catch {}
  }
  const itemWithId: Inquiry = {
    ...inquiry,
    _id: inquiry._id || `local_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
  };
  items.unshift(itemWithId);
  fs.writeFileSync(file, JSON.stringify(items, null, 2));
  return itemWithId;
}

export function getLocalInquiries(): Inquiry[] {
  ensureDir();
  const file = path.join(DATA_DIR, "inquiries_buffer.json");
  if (!fs.existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch {
    return [];
  }
}

export function updateLocalInquiry(id: string, status: Inquiry["status"]): boolean {
  ensureDir();
  const file = path.join(DATA_DIR, "inquiries_buffer.json");
  if (!fs.existsSync(file)) return false;
  try {
    const items: Inquiry[] = JSON.parse(fs.readFileSync(file, "utf-8"));
    const idx = items.findIndex((i) => String(i._id) === id);
    if (idx !== -1) {
      items[idx].status = status;
      items[idx].updatedAt = new Date();
      fs.writeFileSync(file, JSON.stringify(items, null, 2));
      return true;
    }
  } catch {}
  return false;
}

export function deleteLocalInquiry(id: string): boolean {
  ensureDir();
  const file = path.join(DATA_DIR, "inquiries_buffer.json");
  if (!fs.existsSync(file)) return false;
  try {
    let items: Inquiry[] = JSON.parse(fs.readFileSync(file, "utf-8"));
    const before = items.length;
    items = items.filter((i) => String(i._id) !== id);
    if (items.length !== before) {
      fs.writeFileSync(file, JSON.stringify(items, null, 2));
      return true;
    }
  } catch {}
  return false;
}

// Subscribers Local Buffer
export function saveLocalSubscriber(email: string): Subscriber {
  ensureDir();
  const file = path.join(DATA_DIR, "subscribers_buffer.json");
  let items: Subscriber[] = [];
  if (fs.existsSync(file)) {
    try {
      items = JSON.parse(fs.readFileSync(file, "utf-8"));
    } catch {}
  }
  const existing = items.find((s) => s.email.toLowerCase() === email.toLowerCase());
  if (existing) return existing;

  const item: Subscriber = {
    _id: `local_sub_${Date.now()}`,
    email,
    createdAt: new Date(),
  };
  items.unshift(item);
  fs.writeFileSync(file, JSON.stringify(items, null, 2));
  return item;
}

export function getLocalSubscribers(): Subscriber[] {
  ensureDir();
  const file = path.join(DATA_DIR, "subscribers_buffer.json");
  if (!fs.existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch {
    return [];
  }
}
