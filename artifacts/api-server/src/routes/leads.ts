import { Router, type IRouter } from "express";
import { count, eq } from "drizzle-orm";
import { db, leadsTable } from "@workspace/db";

const router: IRouter = Router();

/**
 * GET /api/leads/stats
 * Returns live counts from Supabase: total, hot, warm, cold leads.
 */
router.get("/leads/stats", async (req, res) => {
  try {
    const [totalResult, hotResult, warmResult, coldResult] = await Promise.all([
      db.select({ count: count() }).from(leadsTable),
      db.select({ count: count() }).from(leadsTable).where(eq(leadsTable.isHot,  true)),
      db.select({ count: count() }).from(leadsTable).where(eq(leadsTable.isWarm, true)),
      db.select({ count: count() }).from(leadsTable).where(eq(leadsTable.isCold,  true)),
    ]);

    res.json({
      total: Number(totalResult[0]?.count ?? 0),
      hot:   Number(hotResult[0]?.count   ?? 0),
      warm:  Number(warmResult[0]?.count  ?? 0),
      cold:  Number(coldResult[0]?.count  ?? 0),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch lead stats from Supabase");
    res.status(503).json({ error: "Database unavailable" });
  }
});

export default router;
