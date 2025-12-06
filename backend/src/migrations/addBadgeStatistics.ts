import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: typeof DataTypes) => {
    // إضافة حقول الإحصائيات للـ badges
    await queryInterface.addColumn('products', 'views', {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    });

    await queryInterface.addColumn('products', 'likes', {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    });

    await queryInterface.addColumn('products', 'orders', {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    });

    await queryInterface.addColumn('products', 'badge', {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: 'جديد',
    });

    await queryInterface.addColumn('products', 'tags', {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    });

    await queryInterface.addColumn('products', 'lastBadgeUpdate', {
      type: DataTypes.DATE,
      allowNull: true,
    });

    // إنشاء فهارس للحقول الجديدة
    await queryInterface.addIndex('products', {
      name: 'idx_products_badge',
      fields: ['badge'],
    });

    await queryInterface.addIndex('products', {
      name: 'idx_products_views',
      fields: ['views'],
    });

    await queryInterface.addIndex('products', {
      name: 'idx_products_likes',
      fields: ['likes'],
    });

    await queryInterface.addIndex('products', {
      name: 'idx_products_orders',
      fields: ['orders'],
    });

    console.log('✅ Migration completed: Added badge statistics columns to products table');
  },

  down: async (queryInterface: QueryInterface, Sequelize: typeof DataTypes) => {
    // حذف الفهارس أولاً
    await queryInterface.removeIndex('products', 'idx_products_orders');
    await queryInterface.removeIndex('products', 'idx_products_likes');
    await queryInterface.removeIndex('products', 'idx_products_views');
    await queryInterface.removeIndex('products', 'idx_products_badge');

    // حذف الحقول
    await queryInterface.removeColumn('products', 'lastBadgeUpdate');
    await queryInterface.removeColumn('products', 'tags');
    await queryInterface.removeColumn('products', 'badge');
    await queryInterface.removeColumn('products', 'orders');
    await queryInterface.removeColumn('products', 'likes');
    await queryInterface.removeColumn('products', 'views');

    console.log('✅ Migration rollback completed: Removed badge statistics columns from products table');
  },
};