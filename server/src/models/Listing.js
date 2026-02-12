import { getDatabase } from "../config/database.js";

class Listing {
  static async create(listingData) {
    const sql = getDatabase();

    const {
      sellerId,
      title,
      description,
      animalType,
      breed,
      age,
      weight,
      healthStatus,
      vaccinations,
      medicalHistory,
      location,
      price,
      auctionStartPrice,
      auctionEndTime,
      auctionType,
      isPremium,
      imageUrls,
      videoUrl,
    } = listingData;

    const result = await sql.query(
      `INSERT INTO livestock_listings (
        seller_id, title, description, animal_type, breed, age, weight,
        health_status, vaccinations, medical_history, location, price,
        auction_start_price, auction_end_time, auction_type, is_premium,
        image_urls, video_url, status
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,'active')
      RETURNING *`,
      [
        sellerId,
        title,
        description,
        animalType,
        breed,
        age,
        weight,
        healthStatus,
        JSON.stringify(vaccinations),
        medicalHistory,
        JSON.stringify(location),
        price,
        auctionStartPrice,
        auctionEndTime,
        auctionType,
        isPremium,
        JSON.stringify(imageUrls),
        videoUrl,
      ],
    );

    return result.rows[0];
  }

  static async findById(id) {
    const sql = getDatabase();

    const result = await sql.query(
      `SELECT l.*, u.first_name, u.last_name, u.email, u.phone_number,
        COUNT(b.id) as bid_count, MAX(b.bid_amount) as highest_bid
      FROM livestock_listings l
      LEFT JOIN users u ON l.seller_id = u.id
      LEFT JOIN bids b ON l.id = b.listing_id AND b.status != 'rejected'
      WHERE l.id = $1
      GROUP BY l.id, u.id`,
      [id],
    );

    return result.rows[0];
  }

  static async update(id, updateData) {
    const sql = getDatabase();

    const {
      title,
      description,
      breed,
      age,
      weight,
      healthStatus,
      vaccinations,
      medicalHistory,
      location,
      price,
      isPremium,
      imageUrls,
    } = updateData;

    const result = await sql.query(
      `UPDATE livestock_listings
      SET title = COALESCE($2, title),
          description = COALESCE($3, description),
          breed = COALESCE($4, breed),
          age = COALESCE($5, age),
          weight = COALESCE($6, weight),
          health_status = COALESCE($7, health_status),
          vaccinations = COALESCE($8, vaccinations),
          medical_history = COALESCE($9, medical_history),
          location = COALESCE($10, location),
          price = COALESCE($11, price),
          is_premium = COALESCE($12, is_premium),
          image_urls = COALESCE($13, image_urls),
          updated_at = NOW()
      WHERE id = $1
      RETURNING *`,
      [
        id,
        title,
        description,
        breed,
        age,
        weight,
        healthStatus,
        JSON.stringify(vaccinations),
        medicalHistory,
        JSON.stringify(location),
        price,
        isPremium,
        JSON.stringify(imageUrls),
      ],
    );

    return result.rows[0];
  }

  static async updateStatus(id, status) {
    const sql = getDatabase();

    const result = await sql.query(
      `UPDATE livestock_listings
      SET status = $2, updated_at = NOW()
      WHERE id = $1
      RETURNING *`,
      [id, status],
    );

    return result.rows[0];
  }

  static async search(filters = {}, pagination = {}) {
    const sql = getDatabase();

    const {
      animalType,
      breed,
      minPrice,
      maxPrice,
      healthStatus,
      city,
      state,
      sortBy = "createdAt",
      sortOrder = "desc",
      isPremium,
    } = filters;

    const { limit = 10, offset = 0 } = pagination;

    let query = `
      SELECT l.*, u.first_name, u.last_name, u.email,
        COUNT(b.id) as bid_count, MAX(b.bid_amount) as highest_bid
      FROM livestock_listings l
      LEFT JOIN users u ON l.seller_id = u.id
      LEFT JOIN bids b ON l.id = b.listing_id AND b.status != 'rejected'
      WHERE l.status = 'active'
    `;
    const params = [];

    if (animalType) {
      query += ` AND l.animal_type = $${params.length + 1}`;
      params.push(animalType);
    }
    if (breed) {
      query += ` AND l.breed ILIKE $${params.length + 1}`;
      params.push("%" + breed + "%");
    }
    if (minPrice) {
      query += ` AND l.price >= $${params.length + 1}`;
      params.push(minPrice);
    }
    if (maxPrice) {
      query += ` AND l.price <= $${params.length + 1}`;
      params.push(maxPrice);
    }
    if (healthStatus) {
      query += ` AND l.health_status = $${params.length + 1}`;
      params.push(healthStatus);
    }
    if (city) {
      query += ` AND l.location->>'city' ILIKE $${params.length + 1}`;
      params.push("%" + city + "%");
    }
    if (state) {
      query += ` AND l.location->>'state' ILIKE $${params.length + 1}`;
      params.push("%" + state + "%");
    }
    if (isPremium !== undefined) {
      query += ` AND l.is_premium = $${params.length + 1}`;
      params.push(isPremium);
    }

    let orderColumn = "l.created_at";
    if (sortBy === "price") orderColumn = "l.price";
    if (sortBy === "age") orderColumn = "l.age";

    query += ` GROUP BY l.id, u.id ORDER BY ${orderColumn} ${sortOrder.toUpperCase()} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await sql.query(query, params);

    return { data: result.rows, total: result.rows.length };
  }

  static async getBySellerId(sellerId, pagination = {}) {
    const sql = getDatabase();

    const { limit = 10, offset = 0 } = pagination;

    const result = await sql.query(
      `SELECT * FROM livestock_listings
      WHERE seller_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3`,
      [sellerId, limit, offset],
    );

    const countResult = await sql.query(
      `SELECT COUNT(*) as count FROM livestock_listings WHERE seller_id = $1`,
      [sellerId],
    );

    return {
      data: result.rows,
      total: parseInt(countResult.rows[0].count),
    };
  }

  static async delete(id) {
    const sql = getDatabase();

    const result = await sql.query(
      `DELETE FROM livestock_listings WHERE id = $1
      RETURNING *`,
      [id],
    );

    return result.rows[0];
  }
}

export default Listing;
