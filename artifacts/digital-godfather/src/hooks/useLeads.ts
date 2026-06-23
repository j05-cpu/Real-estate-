import { useState, useEffect, useCallback } from "react";
import { fetchLeads, type Lead } from "@/lib/api";

const FALLBACK_LEADS: Lead[] = [
  { id: 1, name: "Priya Sharma",   phone: "+91 98765 43210", email: "priya@gmail.com",   bhk: "2 BHK", budget: "₹65L",   tag: "Hot"  },
  { id: 2, name: "Amit Verma",     phone: "+91 87654 32109", email: "amit@outlook.com",  bhk: "3 BHK", budget: "₹95L",   tag: "Warm" },
  { id: 3, name: "Rahul Gupta",    phone: "+91 77665 54433", email: "rahul@yahoo.com",   bhk: "2 BHK", budget: "₹58L",   tag: "Hot"  },
  { id: 4, name: "Sunita Nair",    phone: "+91 66554 43322", email: "sunita@gmail.com",  bhk: "1 BHK", budget: "₹38L",   tag: "Cold" },
  { id: 5, name: "Vikram Singh",   phone: "+91 55443 32211", email: "vikram@gmail.com",  bhk: "3 BHK", budget: "₹1.1Cr", tag: "Warm" },
  { id: 6, name: "Neha Joshi",     phone: "+91 44332 21100", email: "neha@gmail.com",    bhk: "2 BHK", budget: "₹72L",   tag: "Hot"  },
  { id: 7, name: "Suresh Patil",   phone: "+91 76543 21098", email: "suresh@gmail.com",  bhk: "1 BHK", budget: "₹40L",   tag: "Cold" },
  { id: 8, name: "Anjali Desai",   phone: "+91 88776 65544", email: "anjali@gmail.com",  bhk: "3 BHK", budget: "₹1.2Cr", tag: "Warm" },
  { id: 9, name: "Kiran Mehta",    phone: "+91 99887 76655", email: "kiran@hotmail.com", bhk: "2 BHK", budget: "₹75L",   tag: "Hot"  },
  { id: 10, name: "Deepak Rao",    phone: "+91 91234 56789", email: "deepak@gmail.com",  bhk: "2 BHK", budget: "₹62L",   tag: "Cold" },
];

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLeads();
      if (data.length > 0) {
        setLeads(data);
        setUsingFallback(false);
      } else {
        setLeads(FALLBACK_LEADS);
        setUsingFallback(true);
      }
    } catch {
      setLeads(FALLBACK_LEADS);
      setUsingFallback(true);
      setError("Could not reach n8n — showing demo data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { leads, loading, error, usingFallback, reload: load };
}
