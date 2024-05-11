
const Command = require('./model')
const path = require('path')
const fs = require('fs')
const config = require('../../config')
module.exports = {
    index: async (req, res) => {
        try {
            const command = await Command.findAll();
            res.status(200).json({ data: command });
        } catch (err) {
            res.status(500).json({message: err.message || 'internal server error'})
        }
    },
    actionCreated: async (req, res,next) => {
       
        try {
            const payload = req.body;

            let newCommand = new Command(payload);
            await newCommand.save()
            res.status(200).json({
                data: newCommand
            })
    
        } catch (err) {
            res.status(500).json({message: err.message || 'internal server error'})
        }
    },
    actionDelete: async (req, res) => {
        try {
            const { id } = req.params;
           
            await Command.destroy({ where:{id: id} });
          
            res.status(200).json({
                message: "Berhasil Hapus Command"
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
            let updateCommand = await Command.findOne({ where: { id: id}});
                updateCommand = await  updateCommand.update(req.body, { where: { id: id } })
                res.status(201).json({
                    data: updateCommand
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