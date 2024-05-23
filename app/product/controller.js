
const { Product, Category, Locations,ProductGallery,Gallery, ProductCategory, Facility, ProductFacility, Operationals } = require('./model');
// kode logika controller
const path = require('path')
const dotenv = require('dotenv');
const fs = require('fs')
const config = require('../../config')
dotenv.config()
module.exports = {
    index: async (req, res) => {
        try {
            const products = await Product.findAll({
                include: [
                    {
                        model: Category,
                        through: {
                            model: ProductCategory,
                        },
                    },
                    {
                        model: Operationals,
                    },
                    {
                        model: Locations,
                    },
                    
                    {
                        model: Facility,
                        through: {
                            model: ProductFacility,
                        },
                    },
                    {
                        model: Gallery,
                        through: {
                            model: ProductGallery,
                        },
                    },
                ],
            });
         

            const formattedProducts = products.map((product) => {
                console.log('====================================');
                console.log(product);
                console.log('====================================');
                return {
                    id: product.id,
                    name: product.name,
                    cover: process.env.URL + product.cover,
                    price: product.price,
                    formatted_currency_price: `Rp.${product.price}`,
                    description: product.description,
                    categories: product.Categories.map((category) => {
                        return {
                            id: category.id,
                            name: category.name,
                        };
                    }),

                    facilitas: product.Facilities.map((facility) => {
                        return {
                            id: facility.id,
                            name: facility.name,
                        };
                    }),

                    gallery: product.Galleries.map((gallery) => {
                        return {
                            id: gallery.id,
                            link:  process.env.URL + gallery.link,
                        };
                    }), 
                    operational: product.Operational,
                    location: product.Location,
                  
                    // ...other product data
                };
            });

            res.status(200).json({ data: formattedProducts });
        } catch (err) {
            res.status(500).json({ message: err.message || 'Internal server error' });
        }
    },
    actionCreated: async (req, res, next) => {

        try {
            const payload = req.body;

            let category = new Category(payload);
            await category.save()
            delete category.password;
            res.status(200).json({
                data: category
            })

        } catch (err) {
            res.status(500).json({ message: err.message || 'internal server error' })
        }
    },
    actionDelete: async (req, res) => {
        try {
            const { id } = req.params;

            await Category.destroy({ where: { id: id } });

            res.status(200).json({
                message: "Berhasil Hapus Category"
            })
        } catch (err) {
            res.status(500).json({ message: err.message || 'internal server error' })
        }
    },
    actionEdit: async (req, res, next) => {
        const { id } = req.params;;
        try {
            const { name = "" } = req.body;
            const payload = {};
            if (name.length) payload.name = name;
            let category = await Category.findOne({ where: { id: id } });
            category = await Category.update({ name: name }, { where: { id: id } })
                .then((updatedRows) => {
                    console.log(`${updatedRows} rows updated successfully.`);
                    res.status(201).json({
                        data: {
                            name: name,
                        }
                    })
                })
                .catch((err) => {
                    console.error('Error:', err);
                    res.status(422).json({
                        error: 1,
                        message: err.message,
                        fields: err.errors
                    })
                });

        } catch (err) {
            if (err && err.name === "ValidationError") {
                res.status(422).json({
                    error: 1,
                    message: err.message,
                    fields: err.errors
                })
            }
        }

    }

}