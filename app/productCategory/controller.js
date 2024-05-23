
const Product = require('./model')
const path = require('path')
const fs = require('fs')
const config = require('../../config')
const Banner = require('../banner/model')
module.exports = {
    index: async (req, res) => {
        try {
            const product = await Product.findAll();
           
            
            res.status(200).json({ data: category });
        } catch (err) {
            res.status(500).json({message: err.message || 'internal server error'})
        }
    },
    actionCreated: async (req, res,next) => {
       
        try {
            const payload = req.body;
            
        let category = new Category(payload);
        await category.save()
        delete category.password;
        res.status(200).json({
            data: category
        })
    
        } catch (err) {
            res.status(500).json({message: err.message || 'internal server error'})
        }
    },
    actionDelete: async (req, res) => {
        try {
            const { id } = req.params;
           
            await Category.destroy({ where:{id: id} });
          
            res.status(200).json({
                message: "Berhasil Hapus Category"
            })
        } catch (err) {
            res.status(500).json({message: err.message || 'internal server error'})
        }
    },
    actionEdit: async (req, res, next) => {
        const { id } = req.params;;
        try {
        const { name = "" } = req.body;
        const payload = {};
        if (name.length) payload.name = name;
            let category = await Category.findOne({ where: { id: id}});
            category = await  Category.update({ name: name }, { where: { id: id } })
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