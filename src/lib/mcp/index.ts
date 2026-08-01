import { defineMcp } from "@lovable.dev/mcp-js";
import searchWorkersTool from "./tools/search-workers";
import getWorkerTool from "./tools/get-worker";
import searchBusinessesTool from "./tools/search-businesses";
import searchDigitalServicesTool from "./tools/search-digital-services";
import searchCoachingCentresTool from "./tools/search-coaching-centres";
import listCategoriesTool from "./tools/list-categories";

export default defineMcp({
  name: "remix-of-rozgar-sewa-connect",
  title: "Remix of Rozgar sewa  Connect",
  version: "0.1.0",
  instructions:
    "Read-only tools for RozgarSewa, a platform that connects rural workers, shops, digital service centres and coaching institutes with customers. Use `list_categories` to discover available categories, `search_workers` and `get_worker` for workers, and `search_businesses`, `search_digital_services` and `search_coaching_centres` for local listings. All data returned is public listing information; phone numbers and PINs are not exposed.",
  tools: [
    listCategoriesTool,
    searchWorkersTool,
    getWorkerTool,
    searchBusinessesTool,
    searchDigitalServicesTool,
    searchCoachingCentresTool,
  ],
});
