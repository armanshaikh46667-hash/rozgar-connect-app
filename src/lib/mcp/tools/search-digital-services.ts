import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "search_digital_services",
  title: "Search digital service centres",
  description:
    "Search public RozgarSewa digital service listings (online forms, printing, Aadhaar/PAN work) by service type or village.",
  inputSchema: {
    service_type: z.string().trim().optional().describe("Service type to filter by, e.g. Printing, Online Form."),
    village: z.string().trim().optional().describe("Village or town name to filter by."),
    limit: z.number().int().optional().describe("Maximum number of listings to return (default 20, max 50)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ service_type, village, limit }) => {
    const take = Math.min(Math.max(limit ?? 20, 1), 50);
    let query = supabaseAnon()
      .from("digital_services")
      .select("id, shop_name, owner_name, service_type, village, address, description, created_at")
      .order("created_at", { ascending: false })
      .limit(take);

    if (service_type) query = query.ilike("service_type", `%${service_type}%`);
    if (village) query = query.ilike("village", `%${village}%`);

    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };

    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { services: data ?? [], count: data?.length ?? 0 },
    };
  },
});
