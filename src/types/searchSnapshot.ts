import { z } from "zod";

import { SearchSnapshotSchema } from "@/schemas/searchSnapshot";

export type SearchSnapshot = z.infer<typeof SearchSnapshotSchema>;
