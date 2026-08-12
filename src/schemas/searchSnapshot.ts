import { z } from "zod";

import { BookSchema } from "@/schemas/books";

export const SearchSnapshotSchema = z.object({
  query: z.string(),
  books: z.array(BookSchema),
  nextStartIndex: z.int().nonnegative(),
  hasMore: z.boolean(),
  scrollY: z.number().nonnegative(),
  savedAt: z.int().nonnegative(),
});
