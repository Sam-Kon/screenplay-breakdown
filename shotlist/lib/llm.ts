import OpenAI from "openai";
import { ShotListResponseSchema, type Shot } from "./schemas";

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

const SYSTEM_PROMPT =
  "You are a cinematographer's assistant. Break the screenplay scene into a shot list. " +
  "Use one shot per distinct action, reaction, or line of dialogue, and do not collapse the scene " +
  "into a single shot; most scenes need 3-8 shots. Vary shot size across the list. " +
  "shotType is the shot size (Wide, Medium, Close-Up, Insert, ...). " +
  "camera is angle and movement (Static eye-level, Handheld, Slow push-in, ...). " +
  "description says what the shot shows and why it's there. " +
  'Respond with JSON only: {"shots": [{"number": 1, "shotType": "...", "camera": "...", "description": "..."}]}.';

export async function generateShots(scene: string): Promise<Shot[]> {
    const res = await client.chat.completions.create({
        model: process.env.GROQ_MODEL ?? 'openai/gpt-oss-120b',
        messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: scene }
        ],
        response_format: { type: "json_object" },
    });
    const text = res.choices[0].message.content ?? "";
    return ShotListResponseSchema.parse(JSON.parse(text)).shots;
}