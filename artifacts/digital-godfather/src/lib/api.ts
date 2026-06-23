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

export interface LeadsResponse {
  leads?: Lead[];
  data?: Lead[];
}

export interface AppointmentsResponse {
  appointments?: Appointment[];
  data?: Appointment[];
}

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
  const data: LeadsResponse | Lead[] = await res.json();
  if (Array.isArray(data)) return data;
  return (data as LeadsResponse).leads ?? (data as LeadsResponse).data ?? [];
}

export async function fetchAppointments(): Promise<Appointment[]> {
  const res = await fetchWithTimeout(N8N_URLS.getAppointments);
  if (!res.ok) throw new Error(`Appointments fetch failed: ${res.status}`);
  const data: AppointmentsResponse | Appointment[] = await res.json();
  if (Array.isArray(data)) return data;
  return (data as AppointmentsResponse).appointments ?? (data as AppointmentsResponse).data ?? [];
}

export async function postSettings(settings: BotSettings): Promise<void> {
  const res = await fetchWithTimeout(N8N_URLS.updateSettings, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error(`Settings update failed: ${res.status}`);
}
