import { useState, useEffect } from "react";
import type { LeadsState } from "@/hooks/useLeads";

export interface LeadStats {
  total: number;
  hot:   number;
  warm:  number;
  cold:  number;
  source: "supabase" | "n8n";
  loading: boolean;
}

/**
 * Tries to fetch live counts from the API (Supabase via Drizzle).
 * Falls back to computing counts from the already-fetched n8n leads.
 */
export function useLeadsStats(leadsState: LeadsState): LeadStats {
  const [dbStats, setDbStats] = useState<{ total:number; hot:number; warm:number; cold:number } | null>(null);
  const [loading, setLoading]  = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch("/api/leads/stats")
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(data => { if (!cancelled) { setDbStats(data); setLoading(false); } })
      .catch(() => { if (!cancelled) { setDbStats(null); setLoading(false); } });
    return () => { cancelled = true; };
  }, []);

  // Re-fetch whenever the n8n poll triggers (approximate: leads list length changes)
  useEffect(() => {
    if (leadsState.syncing) {
      fetch("/api/leads/stats")
        .then(r => r.ok ? r.json() : Promise.reject(r.status))
        .then(data => setDbStats(data))
        .catch(() => {});
    }
  }, [leadsState.syncing]);

  // n8n-computed fallback (always accurate — n8n IS the source of truth)
  const n8nStats = {
    total: leadsState.leads.length,
    hot:   leadsState.leads.filter(l => l.tag === "Hot").length,
    warm:  leadsState.leads.filter(l => l.tag === "Warm").length,
    cold:  leadsState.leads.filter(l => l.tag === "Cold").length,
  };

  if (dbStats !== null) {
    return { ...dbStats, source: "supabase", loading: false };
  }

  return {
    ...n8nStats,
    source: "n8n",
    loading: loading && leadsState.loading,
  };
}
