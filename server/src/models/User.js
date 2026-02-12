import { getDatabase } from "../config/database.js";
import helpers from "../utils/helpers.js";

const { hashPassword } = helpers;

class User {
  static async create(userData) {
    const sql = getDatabase();
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      role,
      address,
      city,
      state,
      zipCode,
      country,
    } = userData;

    const hashedPassword = await hashPassword(password);

    const result = await sql.query(
      `INSERT INTO users (
      first_name, last_name, email, password, phone_number,
      role, address, city, state, zip_code, country
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    RETURNING *`,
      [
        firstName,
        lastName,
        email,
        hashedPassword,
        phoneNumber,
        role,
        address,
        city,
        state,
        zipCode,
        country,
      ],
    );

    return result.rows[0];
  }

  static async findById(id) {
    const sql = getDatabase();

    const result = await sql.query(
      `
      SELECT * FROM users WHERE id = $1
    `,
      [id],
    );

    return result.rows[0];
  }

  static async findByEmail(email) {
    const sql = getDatabase();

    const result = await sql.query(
      `
      SELECT * FROM users WHERE email = $1
    `,
      [email.toLowerCase()],
    );

    return result.rows[0];
  }

  static async findByIdWithRelations(id) {
    const sql = getDatabase();

    const result = await sql.query(
      `
      SELECT u.*,
        COUNT(DISTINCT l.id) as listing_count,
        COUNT(DISTINCT b.id) as bid_count,
        COUNT(DISTINCT t.id) as transaction_count
      FROM users u
      LEFT JOIN livestock_listings l ON u.id = l.seller_id
      LEFT JOIN bids b ON u.id = b.buyer_id
      LEFT JOIN transactions t ON u.id = t.buyer_id
      WHERE u.id = $1
      GROUP BY u.id
    `,
      [id],
    );

    return result.rows[0];
  }

  static async update(id, updateData) {
    const sql = getDatabase();

    const fields = Object.keys(updateData);
    const values = Object.values(updateData);

    if (fields.length === 0) {
      return this.findById(id);
    }

    const setClause = fields
      .map((field, index) => {
        const columnName = field.replace(/([A-Z])/g, "_$1").toLowerCase();
        return `${columnName} = $${index + 1}`;
      })
      .join(", ");

    const query = `
      UPDATE users
      SET ${setClause}, updated_at = NOW()
      WHERE id = $${fields.length + 1}
      RETURNING *
    `;

    const result = await sql.query(query, [...values, id]);
    return result.rows[0];
  }

  static async updateProfile(id, profileData) {
    const sql = getDatabase();

    const {
      firstName,
      lastName,
      phoneNumber,
      address,
      city,
      state,
      zipCode,
      country,
    } = profileData;
    const result = await sql.query(
      `UPDATE users
   SET first_name   = $1,
       last_name    = $2,
       phone_number = $3,
       address      = $4,
       city         = $5,
       state        = $6,
       zip_code     = $7,
       country      = $8,
       updated_at   = NOW()
   WHERE id = $9
   RETURNING *`,
      [
        firstName ?? null,
        lastName ?? null,
        phoneNumber ?? null,
        address ?? null,
        city ?? null,
        state ?? null,
        zipCode ?? null,
        country ?? null,
        id,
      ],
    );
    return result.rows[0];
  }

  static async submitKYC(id, kycData) {
    const sql = getDatabase();

    const {
      idType,
      idNumber,
      documentUrls,
      dateOfBirth,
      address,
      city,
      state,
      zipCode,
    } = kycData;

    const result = await sql.query(
      `UPDATE users
   SET id_type = $1,
       id_number = $2,
       document_urls = $3,
       date_of_birth = $4,
       kyc_status = 'pending',
       address = $5,
       city = $6,
       state = $7,
       zip_code = $8,
       updated_at = NOW()
   WHERE id = $9
   RETURNING *`,
      [
        idType,
        idNumber,
        JSON.stringify(documentUrls),
        dateOfBirth,
        address,
        city,
        state,
        zipCode,
        id,
      ],
    );

    return result.rows[0];
  }

  static async updateKYCStatus(id, status, reason = null) {
    const sql = getDatabase();

    const result = await sql.query(
      `UPDATE users
   SET kyc_status = $1,
       kyc_rejection_reason = $2,
       updated_at = NOW()
   WHERE id = $3
   RETURNING *`,
      [status, reason, id],
    );

    return result.rows[0];
  }

  static async list(filters = {}, pagination = {}) {
    const sql = getDatabase();

    const { role, status, kycStatus, search } = filters;

    const { limit = 10, offset = 0 } = pagination;

    let baseQuery = `SELECT * FROM users WHERE 1=1`;
    let values = [];
    let idx = 1;

    if (role) {
      baseQuery += ` AND role = $${idx++}`;
      values.push(role);
    }

    if (status) {
      baseQuery += ` AND status = $${idx++}`;
      values.push(status);
    }

    if (kycStatus) {
      baseQuery += ` AND kyc_status = $${idx++}`;
      values.push(kycStatus);
    }

    if (search) {
      baseQuery += ` AND (
    first_name ILIKE $${idx}
    OR last_name ILIKE $${idx}
    OR email ILIKE $${idx}
  )`;
      values.push(`%${search}%`);
      idx++;
    }

    // Pagination
    baseQuery += ` ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx++}`;
    values.push(limit, offset);

    const result = await sql.query(baseQuery, values);
    const countResult = await sql.query(`SELECT COUNT(*) FROM users`);

    return {
      data: result,
      total: parseInt(countResult.rows[0].count),
    };
  }

  static async updateRole(id, newRole) {
    const sql = getDatabase();

    const result = await sql.query(
      `
      UPDATE users
      SET role = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `,
      [newRole, id],
    );

    return result.rows[0];
  }

  static async updateStatus(id, status) {
    const sql = getDatabase();

    const result = await sql.query(
      `
      UPDATE users
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `,
      [status, id],
    );

    return result.rows[0];
  }

  static async delete(id) {
    const sql = getDatabase();

    const result = await sql.query(
      `
      DELETE FROM users WHERE id = $1
      RETURNING *
    `,
      [id],
    );

    return result.rows[0];
  }
}

export default User;
