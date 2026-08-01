import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "search_coaching_centres",
  title: "Search coaching centres",
  description:
    "Search public RozgarSewa education and coaching listings by course type or village, including fees and timings.",
  inputSchema: {
    course_type: z.string().trim().optional().describe("Course type to filter by, e.g. Computer, Maths, Spoken English."),
    village: z.string().trim().optional().describe("Village or town name to filter by."),
    limit: z.number().int().optional().describe("Maximum number of listings to return (default 20, max 50)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ course_type, village, limit }) => {
    const take = Math.min(Math.max(limit ?? 20, 1), 50);
    let query = supabaseAnon()
      .from("education_coaching")
      .select("id, institute_name, owner_name, course_type, village, address, description, fees, timing, created_at")
      .order("created_at", { ascending: false })
      .limit(take);

    if (course_type) query = query.ilike("course_type", `%${course_type}%`);
    if (village) query = query.ilike("village", `%${village}%`);

    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };

    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { centres: data ?? [], count: data?.length ?? 0 },
    };
  },
});
