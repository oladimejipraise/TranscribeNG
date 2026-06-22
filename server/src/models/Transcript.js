import { query } from "../config/db.js";

export const Transcript = {
  async create({ userId, title, language, audioUrl, duration }) {
    const { rows } = await query(
      `INSERT INTO transcripts (user_id, title, language, audio_url, duration, status)
       VALUES ($1, $2, $3, $4, $5, 'processing')
       RETURNING *`,
      [userId, title, language, audioUrl, duration]
    );
    return rows[0];
  },

  async findAllByUser(userId) {
    const { rows } = await query(
      `SELECT * FROM transcripts WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    return rows;
  },

  async findById(id, userId) {
    const { rows } = await query(
      `SELECT * FROM transcripts WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );
    return rows[0] || null;
  },

  async updateContent(id, { content, speakers, status }) {
    const { rows } = await query(
      `UPDATE transcripts
       SET content = $1, speakers = $2, status = $3, updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [JSON.stringify(content), speakers, status, id]
    );
    return rows[0];
  },

  async delete(id, userId) {
    await query(
      `DELETE FROM transcripts WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );
  },
};