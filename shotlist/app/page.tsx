"use client";
import { useState } from "react";
import type { Shot } from "@/lib/schemas";

export default function Home() {
  // (1) States for everything that will change over time
  const [scene, setScene] = useState(""); // a string that the user will type in 
  const [shots, setShots] = useState<Shot[]>([]); // array of shots that the server will return
  const [loading, setLoading] = useState(false); // whether the request is processing (false or true)
  const [error, setError] = useState<string | null>(null); // error message (will usually be null)
  
  // (2) Event handler
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); // don't reload the page / stopping the browser's default form reload
    setLoading(true); // show the loading state
    setError(null); // clear any previous error

    try {
      const res = await fetch("/api/shotlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // sending JSON
        body: JSON.stringify({ scene }), // send the scene to the server
      });
      const data = await res.json(); // parse the JSON response
      if (!res.ok) {
        throw new Error(data.error || "Request failed");
      }
      setShots(data.shots); // update the shots state with the response
    } catch (err: any) {
      setError(err.message); // set the error state if something went wrong
    } finally {
      setLoading(false); // hide the loading state once we are done, regardless of success or failure
    }
  }

  // (3) UI
  return (
    <main className="mx-auto max-w-3xl p-8 space-y-6">
      <h1 className="text-2xl font-bold">Shot List Generator</h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          className="w-full h-48 border p-2"
          placeholder="Paste a scene..."
          value={scene}
          onChange={(e) => setScene(e.target.value)}
        />
        <button className="border px-4 py-2" disabled={loading}>
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>

      {error && <p className="text-red-600">{error}</p>}

      {shots.length > 0 && (
        <table className="w-full border text-left">
          <thead>
            <tr>
              <th className="p-2">#</th>
              <th className="p-2">Type</th>
              <th className="p-2">Camera</th>
              <th className="p-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {shots.map((s) => (
              <tr key={s.number} className="border-t">
                <td className="p-2">{s.number}</td>
                <td className="p-2">{s.shotType}</td>
                <td className="p-2">{s.camera}</td>
                <td className="p-2">{s.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}