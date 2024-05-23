const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../database/sequelize');
const ProductCategory = require('../productCategory/model');
const ProductFacility = require('../productFacility/model');
const ProductGallery = require('../productGalery/model');
const Category = require('../categori/model');
const Facility = require('../facility/model');
const Operationals = require('../operational/model');
const Gallery = require('../gallery/model');
class Product extends Model {}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    cover: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: 0,
    },
    product_type_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    LocationId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    vendor_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    // OperationalId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: true,
    // },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Product',
    tableName: 'Products',
    schema: 'public',
  }
);


const Locations = sequelize.define('Locations', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  province_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  city_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  district_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  sub_district_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  latitude: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  longitude: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  
}, {
  tableName: 'Locations',
  schema: 'public',
});

// const indonesia_provinces = sequelize.define('indonesia_provinces', {
//   id: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   code: {
//     type: DataTypes.INTEGER,
//     allowNull: true,
//   },
//   name: {
//     type: DataTypes.INTEGER,
//     allowNull: true,
//   },
 
//   crated_at: {
//     type: DataTypes.DATE,
//     allowNull: false,
//   },
//   updated_at: {
//     type: DataTypes.DATE,
//     allowNull: false,
//   },
  
// }, {
//   tableName: 'indonesia_provinces',
//   schema: 'public',
// });

Product.belongsToMany(Category, { through: ProductCategory });
Product.belongsToMany(Facility, { through: ProductFacility});
Product.belongsToMany(Gallery, { through: ProductGallery});
Product.belongsTo(Operationals);
Product.belongsTo(Locations);

module.exports = {
  Product,
  Category,
  ProductCategory,
  Locations,
  Operationals,
  Facility,
  ProductFacility,
  Gallery,
  ProductGallery
};
