import { Transcript } from "../models/Transcript.js";

export async function exportTranscript(req, res) {
  try {
    const { id } = req.params;
    const { format = "txt" } = req.query;

    const transcript = await Transcript.findById(id, req.userId);
    if (!transcript) return res.status(404).json({ message: "Transcript not found" });

    const aiRes = await fetch(
      `${process.env.AI_SERVICE_URL}/export/${id}?format=${format}`,
      { headers: { "x-user-id": req.userId } }
    );

    if (!aiRes.ok) throw new Error("Export failed");

    const buffer = await aiRes.arrayBuffer();
    const mimeTypes = {
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      pdf:  "application/pdf",
      txt:  "text/plain",
      srt:  "text/plain",
    };

    const filename = `${transcript.title.replace(/\s+/g, "_")}.${format}`;
    res.setHeader("Content-Type", mimeTypes[format] || "application/octet-stream");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error("Export error:", err);
    res.status(500).json({ message: "Export failed" });
  }
}

export async function generateExport(req, res) {
  try {
    const aiRes = await fetch(`${process.env.AI_SERVICE_URL}/export`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(req.body),
    });

    if (!aiRes.ok) throw new Error("Export generation failed");

    const buffer      = await aiRes.arrayBuffer();
    const format      = req.body.format || "docx";
    const title       = req.body.title  || "transcript";
    const mimeTypes   = {
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      pdf:  "application/pdf",
      txt:  "text/plain",
      srt:  "text/plain",
    };

    const filename = `${title.replace(/\s+/g, "_")}.${format}`;
    res.setHeader("Content-Type", mimeTypes[format] || "application/octet-stream");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error("Generate export error:", err);
    res.status(500).json({ message: "Export failed" });
  }
}