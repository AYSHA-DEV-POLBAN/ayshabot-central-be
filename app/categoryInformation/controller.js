const CategoryInformation = require("./model");

module.exports = {
	index: async (req, res) => {
		try {
			const category_information = await CategoryInformation.findAll();
			res.status(200).json({ data: category_information });
		} catch (err) {
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	actionCreated: async (req, res) => {
		try {
			const { name_category_information,  description_category_information} = req.body;

			const newCategoryInformation = await CategoryInformation.create({
				name_category_information, description_category_information
			});
			res.status(200).json({ data: newCategoryInformation, status: "Category Information berhasil dibuat" });
		} catch (err) {
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	actionDelete: async (req, res) => {
		try {
			const { id } = req.params;

			const category_information = await CategoryInformation.findOne({ where: { id: id } });
			if (category_information) {
				await CategoryInformation.destroy({ where: { id: id } });

				res.status(200).json({
					message: "Berhasil Hapus Category Information",
				});
			} else {
				res.status(200).json({
					message: "Data category information tidak ada",
				});
			}
		} catch (err) {
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	actionEdit: async (req, res, next) => {
        const { id } = req.params;
        try {
            const { name_category_information = "", description_category_information = ""} = req.body;
            const payload = {};
            // if (name_category_information.length) payload.name_category_information = name_category_information;
            // if (description_category_information.length) payload.description_category_information = description_category_information;


            // Memastikan bahwa category_information dengan ID tersebut ada
            let category_information = await CategoryInformation.findOne({ where: { id: id } });

            if (!category_information) {
                return res.status(404).json({
                    error: 1,
                    message: "CategoryInformation not found",
                });
            }

            if (category_information.name_category_information != name_category_information) {
            	if (name_category_information.length) payload.name_category_information = name_category_information;
            }

            if (category_information.description_category_information != description_category_information) {
            	if (description_category_information.length) payload.description_category_information = description_category_information;
            }

            // Mengupdate data category_information
            await CategoryInformation.update(payload, { where: { id: id } })
                .then((updatedRows) => {
                    console.log(`${updatedRows} rows updated successfully.`);
                    res.status(200).json({
                        data: {
                            id: id,
                            name_category_information: payload.name_category_information || category_information.name_category_information,
                            description_category_information: payload.description_category_information || category_information.description_category_information,
                        },
						message: "Update Category Information Successfully"
                    });
                })
                .catch((err) => {
                    console.error('Error:', err);
                    res.status(422).json({
                        error: 1,
                        message: err.message,
                        fields: err.errors
                    });
                });

        } catch (err) {
            console.error('Error:', err);
            res.status(500).json({
                error: 1,
                message: 'Internal server error',
            });
        }
    },
};
