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

    const result = await sql`
      INSERT INTO livestock_listings (
        seller_id, title, description, animal_type, breed, age, weight,
        health_status, vaccinations, medical_history, location, price,
        auction_start_price, auction_end_time, auction_type, is_premium,
        image_urls, video_url, status
      ) VALUES (
        ${sellerId}, ${title}, ${description}, ${animalType}, ${breed}, ${age}, ${weight},
        ${healthStatus}, ${JSON.stringify(vaccinations)}, ${medicalHistory},
        ${JSON.stringify(
          location
        )}, ${price}, ${auctionStartPrice}, ${auctionEndTime},
        ${auctionType}, ${isPremium}, ${JSON.stringify(imageUrls)},
        ${videoUrl}, 'active'
      )
      RETURNING *
    `;

    return result[0];
  }

  static async findById(id) {
    const sql = getDatabase();

    const result = await sql`
      SELECT l.*, u.first_name, u.last_name, u.email, u.phone_number,
        COUNT(b.id) as bid_count, MAX(b.bid_amount) as highest_bid
      FROM livestock_listings l
      LEFT JOIN users u ON l.seller_id = u.id
      LEFT JOIN bids b ON l.id = b.listing_id AND b.status != 'rejected'
      WHERE l.id = ${id}
      GROUP BY l.id, u.id
    `;

    return result[0];
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

    const result = await sql`
      UPDATE livestock_listings
      SET title = COALESCE(${title}, title),
          description = COALESCE(${description}, description),
          breed = COALESCE(${breed}, breed),
          age = COALESCE(${age}, age),
          weight = COALESCE(${weight}, weight),
          health_status = COALESCE(${healthStatus}, health_status),
          vaccinations = COALESCE(${JSON.stringify(
            vaccinations
          )}, vaccinations),
          medical_history = COALESCE(${medicalHistory}, medical_history),
          location = COALESCE(${JSON.stringify(location)}, location),
          price = COALESCE(${price}, price),
          is_premium = COALESCE(${isPremium}, is_premium),
          image_urls = COALESCE(${JSON.stringify(imageUrls)}, image_urls),
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    return result[0];
  }

  static async updateStatus(id, status) {
    const sql = getDatabase();

    const result = await sql`
      UPDATE livestock_listings
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    return result[0];
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

    let query = sql`
      SELECT l.*, u.first_name, u.last_name, u.email,
        COUNT(b.id) as bid_count, MAX(b.bid_amount) as highest_bid
      FROM livestock_listings l
      LEFT JOIN users u ON l.seller_id = u.id
      LEFT JOIN bids b ON l.id = b.listing_id AND b.status != 'rejected'
      WHERE l.status = 'active'
    `;

    if (animalType) query = sql`${query} AND l.animal_type = ${animalType}`;
    if (breed) query = sql`${query} AND l.breed ILIKE ${"%" + breed + "%"}`;
    if (minPrice) query = sql`${query} AND l.price >= ${minPrice}`;
    if (maxPrice) query = sql`${query} AND l.price <= ${maxPrice}`;
    if (healthStatus)
      query = sql`${query} AND l.health_status = ${healthStatus}`;
    if (city)
      query = sql`${query} AND l.location->>'city' ILIKE ${"%" + city + "%"}`;
    if (state)
      query = sql`${query} AND l.location->>'state' ILIKE ${"%" + state + "%"}`;
    if (isPremium !== undefined)
      query = sql`${query} AND l.is_premium = ${isPremium}`;

    let orderColumn = "l.created_at";
    if (sortBy === "price") orderColumn = "l.price";
    if (sortBy === "age") orderColumn = "l.age";

    const result = await query`
      GROUP BY l.id, u.id
      ORDER BY ${sql(orderColumn)} ${sql(sortOrder.toUpperCase())}
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countResult = await query``;
    const total = result.length;

    return { data: result, total };
  }

  static async getBySellerId(sellerId, pagination = {}) {
    const sql = getDatabase();

    const { limit = 10, offset = 0 } = pagination;

    const result = await sql`
      SELECT * FROM livestock_listings
      WHERE seller_id = ${sellerId}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countResult = await sql`
      SELECT COUNT(*) FROM livestock_listings WHERE seller_id = ${sellerId}
    `;

    return {
      data: result,
      total: parseInt(countResult[0].count),
    };
  }

  static async delete(id) {
    const sql = getDatabase();

    const result = await sql`
      DELETE FROM livestock_listings WHERE id = ${id}
      RETURNING *
    `;

    return result[0];
  }
}

export default Listing;
