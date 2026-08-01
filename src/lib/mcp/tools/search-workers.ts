import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "search_workers",
  title: "Search workers",
  description:
    "Search RozgarSewa workers (plumbers, electricians, carpenters, etc.) by category, village, or name. Returns public listing details only.",
  inputSchema: {
    category: z.string().trim().optional().describe("Work category, e.g. Plumber, Electrician, Painter."),
    village: z.string().trim().optional().describe("Village or town name to filter by."),
    name: z.string().trim().optional().describe("Partial worker name to search for."),
    limit: z.number().int().optional().describe("Maximum number of workers to return (default 20, max 50)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ category, village, name, limit }) => {
    const take = Math.min(Math.max(limit ?? 20, 1), 50);
    let query = supabaseAnon()
      .from("workers")
      .select(
        "id, name, village, category, experience, about, service_charge, price_min, price_max, availability, status, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(take);

    if (category) query = query.ilike("category", `%${category}%`);
    if (village) query = query.ilike("village", `%${village}%`);
    if (name) query = query.ilike("name", `%${name}%`);

    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };

    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { workers: data ?? [], count: data?.length ?? 0 },
    };
  },
});
