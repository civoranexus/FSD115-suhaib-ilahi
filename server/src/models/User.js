import {getDatabase} from "../config/database.js";

import hashPassword from
 "../utils/helpers.js";

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

    const result = await sql`
      INSERT INTO users (
        first_name, last_name, email, password, phone_number,
        role, address, city, state, zip_code, country
      ) VALUES (
        ${firstName}, ${lastName}, ${email}, ${hashedPassword}, ${phoneNumber},
        ${role}, ${address}, ${city}, ${state}, ${zipCode}, ${country}
      )
      RETURNING *
    `;

    return result[0];
  }

  static async findById(id) {
    const sql = getDatabase();

    const result = await sql`
      SELECT * FROM users WHERE id = ${id}
    `;

    return result[0];
  }

  static async findByEmail(email) {
    const sql = getDatabase();

    const result = await sql`
      SELECT * FROM users WHERE email = ${email.toLowerCase()}
    `;

    return result[0];
  }

  static async findByIdWithRelations(id) {
    const sql = getDatabase();

    const result = await sql`
      SELECT u.*,
        COUNT(DISTINCT l.id) as listing_count,
        COUNT(DISTINCT b.id) as bid_count,
        COUNT(DISTINCT t.id) as transaction_count
      FROM users u
      LEFT JOIN livestock_listings l ON u.id = l.seller_id
      LEFT JOIN bids b ON u.id = b.buyer_id
      LEFT JOIN transactions t ON u.id = t.buyer_id
      WHERE u.id = ${id}
      GROUP BY u.id
    `;

    return result[0];
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

    const result = await sql.unsafe(query, [...values, id]);
    return result[0];
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

    const result = await sql`
      UPDATE users
      SET first_name = ${firstName || null},
          last_name = ${lastName || null},
          phone_number = ${phoneNumber || null},
          address = ${address || null},
          city = ${city || null},
          state = ${state || null},
          zip_code = ${zipCode || null},
          country = ${country || null},
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    return result[0];
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

    const result = await sql`
      UPDATE users
      SET id_type = ${idType},
          id_number = ${idNumber},
          document_urls = ${JSON.stringify(documentUrls)},
          date_of_birth = ${dateOfBirth},
          kyc_status = 'pending',
          address = ${address},
          city = ${city},
          state = ${state},
          zip_code = ${zipCode},
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    return result[0];
  }

  static async updateKYCStatus(id, status, reason = null) {
    const sql = getDatabase();

    const result = await sql`
      UPDATE users
      SET kyc_status = ${status},
          kyc_rejection_reason = ${reason},
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    return result[0];
  }

  static async list(filters = {}, pagination = {}) {
    const sql = getDatabase();

    const { role, status, kycStatus, search } = filters;

    const { limit = 10, offset = 0 } = pagination;

    let query = sql`
      SELECT * FROM users
      WHERE 1=1
    `;

    if (role) query = sql`${query} AND role = ${role}`;
    if (status) query = sql`${query} AND status = ${status}`;
    if (kycStatus) query = sql`${query} AND kyc_status = ${kycStatus}`;
    if (search) {
      query = sql`
        ${query}
        AND (first_name ILIKE ${"%" + search + "%"}
          OR last_name ILIKE ${"%" + search + "%"}
          OR email ILIKE ${"%" + search + "%"})
      `;
    }

    const result = await query`
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countResult = await sql`SELECT COUNT(*) FROM users`;
    const total = parseInt(countResult[0].count);

    return { data: result, total };
  }

  static async updateRole(id, newRole) {
    const sql = getDatabase();

    const result = await sql`
      UPDATE users
      SET role = ${newRole}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    return result[0];
  }

  static async updateStatus(id, status) {
    const sql = getDatabase();

    const result = await sql`
      UPDATE users
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    return result[0];
  }

  static async delete(id) {
    const sql = getDatabase();

    const result = await sql`
      DELETE FROM users WHERE id = ${id}
      RETURNING *
    `;

    return result[0];
  }
}

export default User;
