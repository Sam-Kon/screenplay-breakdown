# Screenplay Breakdown (Scene --> Shot List Generator)

Just a fun project to learn React & TypeScript!

Paste a screenplay scene, get a detailed shot list back: [<live demo here>](https://screenplay-breakdown.vercel.app/)

## Stack
Next.js (App Router) · React · TypeScript · zod · Groq · Vercel

## API
| Method | Path | Success | Errors |
|---|---|---|---|
| POST | /api/shotlist | 201 + record | 400 invalid input, 502 model failure |
| GET | /api/shotlist | 200 + list | |
| GET | /api/shotlist/:id | 200 + record | 404 |
| DELETE | /api/shotlist/:id | 204 | 404 |

## Limitations
In-memory store (resets on restart, not shared across serverless instances); no auth or rate limiting.