#!/usr/bin/env node

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Sequelize = require('sequelize');

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
    })
  : new Sequelize(
      process.env.DB_NAME || 'eishro_db',
      process.env.DB_USER || 'root',
      process.env.DB_PASSWORD || '',
      {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306', 10),
        dialect: 'mysql',
        logging: false,
      }
    );

async function cleanup() {
  try {
    console.log('🔌 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connection established\n');

    const storeName = 'Indeesh';
    const storeSlug = 'indeesh';
    const emails = ['salem.eshger@gmail.com', 'fahmi.aghmati@gmail.com'];

    console.log('🔍 Checking for existing data...\n');

    // Check for store
    const storeCheck = await sequelize.query(
      `SELECT id, name, slug FROM stores WHERE name = ? OR slug = ?`,
      {
        replacements: [storeName, storeSlug],
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (storeCheck.length > 0) {
      console.log('⚠️  Found store(s):');
      storeCheck.forEach(store => {
        console.log(`   - ID: ${store.id}, Name: ${store.name}, Slug: ${store.slug}`);
      });
    } else {
      console.log('✅ No existing store found');
    }

    // Check for users
    const userCheck = await sequelize.query(
      `SELECT id, email, firstName, lastName FROM users WHERE email IN (?, ?)`,
      {
        replacements: emails,
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (userCheck.length > 0) {
      console.log('\n⚠️  Found user(s):');
      userCheck.forEach(user => {
        console.log(`   - ID: ${user.id}, Email: ${user.email}, Name: ${user.firstName} ${user.lastName}`);
      });
    } else {
      console.log('✅ No existing users found');
    }

    // Ask for confirmation if data exists
    if (storeCheck.length > 0 || userCheck.length > 0) {
      console.log('\n⚠️  Data exists. Proceeding with cleanup...\n');

      // Delete store
      if (storeCheck.length > 0) {
        await sequelize.query(
          `DELETE FROM stores WHERE name = ? OR slug = ?`,
          {
            replacements: [storeName, storeSlug],
          }
        );
        console.log('🗑️  Deleted store(s)');
      }

      // Delete users
      if (userCheck.length > 0) {
        await sequelize.query(
          `DELETE FROM users WHERE email IN (?, ?)`,
          {
            replacements: emails,
          }
        );
        console.log('🗑️  Deleted user(s)');
      }

      console.log('\n✅ Cleanup completed successfully!');
    } else {
      console.log('\n✅ No cleanup needed. System is clean and ready for store creation!');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

cleanup();
