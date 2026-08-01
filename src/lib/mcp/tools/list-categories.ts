import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "list_categories",
  title: "List categories",
  description:
    "List the work and business categories that currently have listings on RozgarSewa, with a count for each.",
  inputSchema: {
    kind: z
      .enum(["workers", "businesses", "all"])
      .optional()
      .describe("Which listings to summarise: workers, businesses, or all (default)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ kind }) => {
    const which = kind ?? "all";
    const supabase = supabaseAnon();
    const tally = (rows: { category: string | null }[] | null) => {
      const counts: Record<string, number> = {};
      for (const row of rows ?? []) {
        const key = (row.category ?? "").trim() || "Other";
        counts[key] = (counts[key] ?? 0) + 1;
      }
      return Object.entries(counts)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count);
    };

    const result: Record<string, { category: string; count: number }[]> = {};

    if (which === "workers" || which === "all") {
      const { data, error } = await supabase.from("workers").select("category").limit(1000);
      if (error) return { content: [{ type: "text", text: error.message }], isError: true };
      result.workers = tally(data);
    }
    if (which === "businesses" || which === "all") {
      const { data, error } = await supabase.from("local_businesses").select("category").limit(1000);
      if (error) return { content: [{ type: "text", text: error.message }], isError: true };
      result.businesses = tally(data);
    }

    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      structuredContent: result,
    };
  },
});
