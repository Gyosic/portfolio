import { z } from "zod";

export default z.object({
  filename: z.string(),
  lastModified: z.number(),
  mimetype: z.string(),
  originalname: z.string(),
  size: z.number(),
  url: z.string(),
});
