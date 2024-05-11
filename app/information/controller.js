
const Information = require('./model')
const path = require('path')
const fs = require('fs')
const config = require('../../config')
module.exports = {
    index: async (req, res) => {
        try {
            const informasi = await Information.findAll();
            res.status(200).json({ data: informasi });
        } catch (err) {
            res.status(500).json({message: err.message || 'internal server error'})
        }
    },
    actionCreated: async (req, res,next) => {
       
        try {
            const payload = req.body;

            let newInformasi = new Information(payload);
            await newInformasi.save()
            res.status(200).json({
                data: newInformasi
            })
    
        } catch (err) {
            res.status(500).json({message: err.message || 'internal server error'})
        }
    },
    actionDelete: async (req, res) => {
        try {
            const { id } = req.params;
           
            await Information.destroy({ where:{id: id} });
          
            res.status(200).json({
                message: "Berhasil Hapus Informasi"
            })
        } catch (err) {
            res.status(500).json({message: err.message || 'internal server error'})
        }
    },
    actionEdit: async (req, res, next) => {
        const { id } = req.params;;
        // res.status(201).json({
        //     data: req.body
        // })
        try {
            let updateInformasi = await Information.findOne({ where: { id: id}});
                updateInformasi = await  updateInformasi.update(req.body, { where: { id: id } })
                res.status(201).json({
                    data: updateInformasi
                })

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