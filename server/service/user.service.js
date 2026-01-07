import { pool } from "../../db/mysql.js";
import { v4 as uuid } from "uuid";
import { hashPassword, verifyPassword } from "../../utils/password.util.js";

export const createUser = async (data) => {
  const id = uuid();
  const passwordHash = await hashPassword(data.password);

  await pool.execute(
    `INSERT INTO users (id, full_name, email, phone, password_hash, role)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, data.fullName, data.email, data.phone, passwordHash, data.role]
  );

  return id;
};

export const findUserByEmailOrPhone = async (identifier) => {
  const [rows] = await pool.execute(
    `SELECT * FROM users WHERE email = ? OR phone = ? AND is_active = TRUE`,
    [identifier, identifier]
  );
  return rows[0];
};

export const getUserById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT id, full_name, email, phone, role FROM users WHERE id = ?`,
    [id]
  );
  return rows[0];
};
