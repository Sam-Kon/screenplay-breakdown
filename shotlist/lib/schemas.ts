import { z } from "zod";

// What the client must send
export const RequestSchema = z.object({
  scene: z.string().min(20, "Scene is too short").max(8000, "Scene is too long"),
});

// What one shot looks like
export const ShotSchema = z.object({
  number: z.number().int(),
  shotType: z.string(),    // "Wide", "Close-up", ...
  camera: z.string(),      // "Handheld, eye level", ...
  description: z.string(),
});

export const ShotListSchema = z.array(ShotSchema);
export const ShotListResponseSchema = z.object({
  shots: ShotListSchema,
});

// Derive the TS type from the schema so they can't drift apart
export type Shot = z.infer<typeof ShotSchema>;