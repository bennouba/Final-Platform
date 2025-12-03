import sequelize from '@config/database';
import logger from '@utils/logger';

const createTables = async (): Promise<void> => {
  try {
    // Users table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        role ENUM('customer', 'merchant', 'admin') DEFAULT 'customer',

        -- Merchant Info (Optional)
        store_name VARCHAR(255),
        store_slug VARCHAR(255) UNIQUE,
        store_category VARCHAR(100),
        store_description TEXT,
        store_logo VARCHAR(500),
        merchant_verified BOOLEAN DEFAULT FALSE,

        -- Timestamps
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        last_login TIMESTAMP NULL,

        -- Indexes
        KEY idx_email (email),
        KEY idx_role (role),
        KEY idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Stores table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS stores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        merchant_id VARCHAR(36) NOT NULL,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        category VARCHAR(100) NOT NULL,
        description TEXT,
        logo VARCHAR(500),
        banner VARCHAR(500),

        -- Status
        is_active BOOLEAN DEFAULT TRUE,
        rating DECIMAL(3, 1),

        -- Timestamps
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

        -- Foreign Key
        CONSTRAINT fk_stores_merchant FOREIGN KEY (merchant_id)
          REFERENCES users(id) ON DELETE CASCADE,

        -- Indexes
        KEY idx_merchant_id (merchant_id),
        KEY idx_slug (slug)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Products table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 3) NOT NULL,
        category VARCHAR(100) NOT NULL,
        brand VARCHAR(100),
        image VARCHAR(500),
        thumbnail VARCHAR(500),

        -- Store Reference
        store_id INT,

        -- Stock Info
        in_stock BOOLEAN DEFAULT TRUE,
        quantity INT DEFAULT 0,
        sku VARCHAR(100),

        -- Rating
        rating DECIMAL(3, 1),
        review_count INT DEFAULT 0,

        -- Metadata
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

        -- Foreign Key
        CONSTRAINT fk_products_store FOREIGN KEY (store_id)
          REFERENCES stores(id) ON DELETE SET NULL,

        -- Indexes
        KEY idx_category (category),
        KEY idx_store_id (store_id),
        KEY idx_created_at (created_at),
        KEY idx_in_stock (in_stock),
        FULLTEXT idx_name_description (name, description)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Orders table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(36) PRIMARY KEY,
        order_number VARCHAR(50) UNIQUE NOT NULL,

        -- Customer (FK or Guest)
        customer_id VARCHAR(36),

        -- Customer Details (Stored)
        customer_first_name VARCHAR(100) NOT NULL,
        customer_last_name VARCHAR(100) NOT NULL,
        customer_phone VARCHAR(20) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_address TEXT NOT NULL,
        customer_city VARCHAR(100) NOT NULL,
        customer_area VARCHAR(100) NOT NULL,

        -- Optional Location
        location_latitude DECIMAL(10, 8),
        location_longitude DECIMAL(11, 8),
        location_accuracy INT,
        location_address TEXT,

        -- Order Amounts
        subtotal DECIMAL(10, 3) NOT NULL,
        discount_amount DECIMAL(10, 3) DEFAULT 0,
        discount_percentage INT DEFAULT 0,
        shipping_cost DECIMAL(10, 3) NOT NULL,
        final_total DECIMAL(10, 3) NOT NULL,

        -- Coupon
        coupon_code VARCHAR(50),

        -- Shipping
        shipping_type ENUM('normal', 'express') DEFAULT 'normal',
        shipping_estimated_time VARCHAR(50),

        -- Payment
        payment_method ENUM('onDelivery', 'immediate') NOT NULL,
        payment_type VARCHAR(50),
        transaction_id VARCHAR(255),
        payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',

        -- Status
        order_status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')
          DEFAULT 'pending',

        -- Notes
        notes TEXT,

        -- Timestamps
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        shipped_at TIMESTAMP NULL,
        delivered_at TIMESTAMP NULL,

        -- Foreign Key
        CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id)
          REFERENCES users(id) ON DELETE SET NULL,

        -- Indexes
        KEY idx_order_number (order_number),
        KEY idx_customer_id (customer_id),
        KEY idx_status (order_status),
        KEY idx_payment_status (payment_status),
        KEY idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Order items table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id VARCHAR(36) NOT NULL,
        product_id INT NOT NULL,

        -- Product Info (Stored Snapshot)
        product_name VARCHAR(255) NOT NULL,
        product_price DECIMAL(10, 3) NOT NULL,
        product_image VARCHAR(500),

        -- Order Details
        size VARCHAR(50),
        color VARCHAR(50),
        quantity INT NOT NULL,

        -- Line Total
        line_total DECIMAL(10, 3) NOT NULL,

        -- Timestamps
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        -- Foreign Keys
        CONSTRAINT fk_order_items_order FOREIGN KEY (order_id)
          REFERENCES orders(id) ON DELETE CASCADE,
        CONSTRAINT fk_order_items_product FOREIGN KEY (product_id)
          REFERENCES products(id) ON DELETE RESTRICT,

        -- Indexes
        KEY idx_order_id (order_id),
        KEY idx_product_id (product_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Coupons table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS coupons (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        description TEXT,

        -- Discount
        discount_percentage INT NOT NULL,
        discount_amount DECIMAL(10, 3),

        -- Conditions
        min_order_amount DECIMAL(10, 3),
        max_order_amount DECIMAL(10, 3),

        -- Limits
        max_uses INT,
        current_uses INT DEFAULT 0,
        max_uses_per_user INT DEFAULT 1,

        -- Status
        is_active BOOLEAN DEFAULT TRUE,

        -- Dates
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NULL,

        -- Indexes
        KEY idx_code (code),
        KEY idx_active (is_active),
        KEY idx_expires_at (expires_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // User addresses table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS user_addresses (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,

        city VARCHAR(100) NOT NULL,
        area VARCHAR(100) NOT NULL,
        address TEXT NOT NULL,
        phone VARCHAR(20) NOT NULL,

        is_default BOOLEAN DEFAULT FALSE,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

        -- Foreign Key
        CONSTRAINT fk_addresses_user FOREIGN KEY (user_id)
          REFERENCES users(id) ON DELETE CASCADE,

        -- Indexes
        KEY idx_user_id (user_id),
        KEY idx_is_default (is_default)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Payments table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id VARCHAR(36) PRIMARY KEY,
        order_id VARCHAR(36) NOT NULL,

        -- Payment Details
        transaction_id VARCHAR(255) UNIQUE,
        amount DECIMAL(10, 3) NOT NULL,
        currency VARCHAR(3) DEFAULT 'LYD',

        -- Gateway Info
        gateway ENUM('moamalat', 'fawry', 'paypal') NOT NULL,
        gateway_response LONGTEXT,

        -- Status
        status ENUM('pending', 'processing', 'completed', 'failed', 'refunded')
          DEFAULT 'pending',

        -- Secure Hash (Moamalat)
        secure_hash VARCHAR(255),
        merchant_reference VARCHAR(255),
        system_reference VARCHAR(255),
        network_reference VARCHAR(255),

        -- Timestamps
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        completed_at TIMESTAMP NULL,

        -- Foreign Key
        CONSTRAINT fk_payments_order FOREIGN KEY (order_id)
          REFERENCES orders(id) ON DELETE CASCADE,

        -- Indexes
        KEY idx_order_id (order_id),
        KEY idx_transaction_id (transaction_id),
        KEY idx_status (status),
        KEY idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Product images table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS product_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,

        image_url VARCHAR(500) NOT NULL,
        alt_text VARCHAR(255),
        sort_order INT DEFAULT 0,

        is_primary BOOLEAN DEFAULT FALSE,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        -- Foreign Key
        CONSTRAINT fk_images_product FOREIGN KEY (product_id)
          REFERENCES products(id) ON DELETE CASCADE,

        -- Indexes
        KEY idx_product_id (product_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Audit log table for security
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(36),
        action VARCHAR(100) NOT NULL,
        table_name VARCHAR(100),
        record_id VARCHAR(36),
        old_values JSON,
        new_values JSON,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        -- Indexes
        KEY idx_user_id (user_id),
        KEY idx_action (action),
        KEY idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    logger.info('✅ All database tables created successfully');
  } catch (error) {
    logger.error('❌ Error creating database tables:', error);
    throw error;
  }
};

const runMigrations = async (): Promise<void> => {
  try {
    logger.info('🚀 Starting database migration...');

    // Test connection
    const { testConnection } = await import('@config/database');
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Database connection failed');
    }

    // Create tables
    await createTables();

    logger.info('✅ Database migration completed successfully');
  } catch (error) {
    logger.error('❌ Database migration failed:', error);
    throw error;
  }
};

// Run migration if called directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      logger.info('🎉 Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('💥 Migration script failed:', error);
      process.exit(1);
    });
}

export default runMigrations;
