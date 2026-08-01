import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "get_worker",
  title: "Get worker profile",
  description:
    "Get the full public profile of one RozgarSewa worker by id, including experience, pricing, availability, ratings and reviews.",
  inputSchema: {
    id: z.string().trim().min(1).describe("The worker's id (uuid) from search_workers."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ id }) => {
    const { data, error } = await supabaseAnon()
      .from("workers")
      .select(
        "id, name, village, category, experience, about, photo, gallery, service_charge, price_min, price_max, availability, status, ratings, reviews, created_at",
      )
      .eq("id", id)
      .maybeSingle();

    if (error) throw new ToolError(error.message);
    if (!data) throw new ToolError(`No worker found with id ${id}`);

    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { worker: data },
    };
  },
});
