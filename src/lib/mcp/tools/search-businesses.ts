import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "search_businesses",
  title: "Search local businesses",
  description:
    "Search public RozgarSewa local business listings (shops, construction, agriculture, vehicle and home services) by category or village.",
  inputSchema: {
    category: z.string().trim().optional().describe("Business category to filter by, e.g. Shop, Construction."),
    village: z.string().trim().optional().describe("Village or town name to filter by."),
    limit: z.number().int().optional().describe("Maximum number of businesses to return (default 20, max 50)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ category, village, limit }) => {
    const take = Math.min(Math.max(limit ?? 20, 1), 50);
    let query = supabaseAnon()
      .from("local_businesses")
      .select("id, name, category, village, address, description, created_at")
      .order("created_at", { ascending: false })
      .limit(take);

    if (category) query = query.ilike("category", `%${category}%`);
    if (village) query = query.ilike("village", `%${village}%`);

    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };

    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { businesses: data ?? [], count: data?.length ?? 0 },
    };
  },
});
