import { useState, useEffect, useCallback } from "react";
import { fetchAppointments, type Appointment } from "@/lib/api";

const FALLBACK_APPOINTMENTS: Appointment[] = [
  { id: 1, buyerName: "Priya Sharma",       phone: "+91 98765 43210", location: "Godfather Heights, Panvel — Phase 2, Tower B", date: "2026-06-23", time: "10:00 AM", duration: "1.5 hrs", bhk: "2 BHK", budget: "₹65L",   status: "Confirmed",   tag: "Hot"  },
  { id: 2, buyerName: "Amit Verma",         phone: "+91 87654 32109", location: "Godfather Residency, Panvel — Phase 1, Tower A", date: "2026-06-24", time: "2:00 PM",  duration: "2 hrs",   bhk: "3 BHK", budget: "₹95L",   status: "Pending",     tag: "Warm" },
  { id: 3, buyerName: "Neha & Rahul Joshi", phone: "+91 99887 76543", location: "Godfather Heights, Panvel — Phase 2, Tower C", date: "2026-06-26", time: "11:30 AM", duration: "2 hrs",   bhk: "2 BHK", budget: "₹72L",   status: "Confirmed",   tag: "Hot"  },
  { id: 4, buyerName: "Suresh Patil",       phone: "+91 76543 21098", location: "Godfather Residency, Panvel — Phase 1, Tower D", date: "2026-06-26", time: "4:00 PM",  duration: "1 hr",    bhk: "1 BHK", budget: "₹40L",   status: "Email Sent",  tag: "Cold" },
  { id: 5, buyerName: "Anjali & Vivek Desai", phone: "+91 88776 65544", location: "Godfather Heights, Panvel — Phase 3, Tower A", date: "2026-06-28", time: "10:00 AM", duration: "2.5 hrs", bhk: "3 BHK", budget: "₹1.2Cr", status: "Confirmed",   tag: "Warm" },
];

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAppointments();
      if (data.length > 0) {
        setAppointments(data);
        setUsingFallback(false);
      } else {
        setAppointments(FALLBACK_APPOINTMENTS);
        setUsingFallback(true);
      }
    } catch {
      setAppointments(FALLBACK_APPOINTMENTS);
      setUsingFallback(true);
      setError("Could not reach n8n — showing demo data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { appointments, loading, error, usingFallback, reload: load };
}
