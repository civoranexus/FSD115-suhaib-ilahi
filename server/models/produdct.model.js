CREATE TABLE products (
  id CHAR(36) PRIMARY KEY,
  seller_id CHAR(36) NOT NULL,

  title VARCHAR(150) NOT NULL,
  description TEXT,

  species ENUM('COW','BUFFALO','GOAT','SHEEP','OTHER') NOT NULL,
  breed VARCHAR(100),

  age_months INT NOT NULL,
  gender ENUM('MALE','FEMALE') NOT NULL,
  weight_kg DECIMAL(6,2),

  price DECIMAL(10,2) NOT NULL,
  sale_type ENUM('DIRECT','BID') NOT NULL,

  status ENUM('DRAFT','ACTIVE','SOLD','DISABLED') DEFAULT 'DRAFT',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (seller_id) REFERENCES users(id),

  INDEX idx_status (status),
  INDEX idx_species (species),
  INDEX idx_price (price)
);
