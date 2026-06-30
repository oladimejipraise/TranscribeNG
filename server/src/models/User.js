import { query } from "../config/db.js";

export const User = {
  async create({ name, email, passwordHash }) {
    const { rows } = await query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name, email, passwordHash]
    );
    return rows[0];
  },

  async findByEmail(email) {
    const { rows } = await query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    return rows[0] || null;
  },

  async findById(id) {
    const { rows } = await query(
      `SELECT id, name, email, created_at FROM users WHERE id = $1`,
      [id]
    );
    return rows[0] || null;
  },

   async updatePassword(id, passwordHash) {
    const { rows } = await query(
      `UPDATE users SET password_hash = $1 WHERE id = $2
       RETURNING id, name, email, created_at`,
      [passwordHash, id]
    );
    return rows[0];
  },
};