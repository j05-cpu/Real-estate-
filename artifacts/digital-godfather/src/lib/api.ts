export const N8N_URLS = {
  getLeads: "https://n8n-production-8556.up.railway.app/webhook/get-leads",
  updateSettings: "https://n8n-production-8556.up.railway.app/webhook/update-settings",
  getAppointments: "https://n8n-production-8556.up.railway.app/webhook/get-appointments",
} as const;

export interface Lead {
  id?: string | number;
  name: string;
  phone: string;
  email: string;
  bhk: string;
  budget: string;
  tag: "Hot" | "Warm" | "Cold";
}

export interface Appointment {
  id?: string | number;
  buyerName: string;
  phone?: string;
  location: string;
  date: string;
  time: string;
  duration?: string;
  bhk?: string;
  budget?: string;
  status: "Confirmed" | "Pending" | "Email Sent";
  tag: "Hot" | "Warm" | "Cold";
}

export interface BotSettings {
  projectName: string;
  startingPrice: string;
  possessionDate: string;
  locationDetails: string;
  bhkOptions: string[];
  tone: "Friendly" | "Professional" | "Aggressive";
  language: "hinglish" | "hindi" | "english" | "marathi";
  greetingMessage: string;
  autoSchedule: boolean;
  autoBrochure: boolean;
}

// ---------- helpers ----------

/** Pick the first key from obj that matches any candidate (case-insensitive). */
function pick(obj: Record<string, unknown>, ...candidates: string[]): string {
  for (const key of Object.keys(obj)) {
    if (candidates.some(c => c.toLowerCase() === key.toLowerCase())) {
      const v = obj[key];
      if (v !== null && v !== undefined) return String(v);
    }
  }
  return "";
}

function normalizeTag(raw: string): "Hot" | "Warm" | "Cold" {
  const v = raw?.toLowerCase() ?? "";
  if (v === "hot")  return "Hot";
  if (v === "warm") return "Warm";
  return "Cold";
}

function normalizeStatus(raw: string): "Confirmed" | "Pending" | "Email Sent" {
  const v = raw?.toLowerCase() ?? "";
  if (v.includes("confirm")) return "Confirmed";
  if (v.includes("email"))   return "Email Sent";
  return "Pending";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeLead(raw: any, index: number): Lead {
  const r = raw as Record<string, unknown>;
  return {
    id:     raw.id ?? index,
    name:   pick(r, "name", "Name", "lead_name", "leadName", "buyer_name", "buyerName", "fullName", "full_name", "contact_name", "contactName") || `Lead ${index + 1}`,
    phone:  pick(r, "phone", "Phone", "phone_number", "phoneNumber", "mobile", "Mobile", "contact", "Contact", "whatsapp", "WhatsApp"),
    email:  pick(r, "email", "Email", "email_address", "emailAddress"),
    bhk:    pick(r, "bhk", "BHK", "bhk_type", "bhkType", "unit_type", "unitType", "configuration"),
    budget: pick(r, "budget", "Budget", "price", "Price", "budget_range", "budgetRange"),
    tag:    normalizeTag(pick(r, "tag", "Tag", "status", "Status", "lead_status", "leadStatus", "category", "Category", "ai_tag", "aiTag", "label", "Label")),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeAppointment(raw: any, index: number): Appointment {
  const r = raw as Record<string, unknown>;
  return {
    id:       raw.id ?? index,
    buyerName: pick(r, "buyerName", "buyer_name", "name", "Name", "lead_name", "leadName", "fullName", "full_name", "contact_name") || `Visitor ${index + 1}`,
    phone:    pick(r, "phone", "Phone", "phone_number", "phoneNumber", "mobile", "Mobile"),
    location: pick(r, "location", "Location", "address", "Address", "site", "Site", "property", "Property", "venue", "Venue") || "Godfather Heights, Panvel",
    date:     pick(r, "date", "Date", "visit_date", "visitDate", "appointment_date", "appointmentDate", "scheduled_date"),
    time:     pick(r, "time", "Time", "visit_time", "visitTime", "appointment_time", "slot_time", "slotTime"),
    duration: pick(r, "duration", "Duration", "time_duration") || undefined,
    bhk:      pick(r, "bhk", "BHK", "bhk_type", "unit_type", "unitType", "configuration") || undefined,
    budget:   pick(r, "budget", "Budget", "price", "Price") || undefined,
    status:   normalizeStatus(pick(r, "status", "Status", "visit_status", "visitStatus", "appointment_status")),
    tag:      normalizeTag(pick(r, "tag", "Tag", "lead_status", "leadStatus", "category", "Category", "label")),
  };
}

// ---------- fetch ----------

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 10000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

export async function fetchLeads(): Promise<Lead[]> {
  const res = await fetchWithTimeout(N8N_URLS.getLeads);
  if (!res.ok) throw new Error(`Leads fetch failed: ${res.status}`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await res.json();
  const arr: unknown[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.leads)   ? data.leads
    : Array.isArray(data?.data)    ? data.data
    : Array.isArray(data?.records) ? data.records
    : [];
  return arr.map((r, i) => normalizeLead(r, i));
}

export async function fetchAppointments(): Promise<Appointment[]> {
  const res = await fetchWithTimeout(N8N_URLS.getAppointments);
  if (!res.ok) throw new Error(`Appointments fetch failed: ${res.status}`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await res.json();
  const arr: unknown[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.appointments) ? data.appointments
    : Array.isArray(data?.data)         ? data.data
    : Array.isArray(data?.records)      ? data.records
    : [];
  return arr.map((r, i) => normalizeAppointment(r, i));
}

export async function postSettings(settings: BotSettings): Promise<void> {
  const params = new URLSearchParams(
    Object.entries(settings).map(([k, v]) => [k, typeof v === "object" ? JSON.stringify(v) : String(v)])
  );
  const res = await fetchWithTimeout(`${N8N_URLS.updateSettings}?${params.toString()}`);
  if (!res.ok) throw new Error(`Settings update failed: ${res.status}`);
}
