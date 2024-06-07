const User = require("./model");
const bcrypt = require("bcryptjs");

module.exports = {
	users: async (req, res) => {
		try {
			const user = await User.findAll();
			res.status(200).json({ data: user });
		} catch (err) {
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	add_operator: async (req, res) => {
		try {
			const { role_id, name, email, password,status } = req.body;

			// Hash the password
			const hashedPassword = await bcrypt.hash(password, 10);

			const newUser = await User.create({
				role_id,
				name,
				email,
				password: hashedPassword,
				status,
			});
			res.status(200).json({ data: newUser, status:"User berhasil dibuat" });
		} catch (err) {
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	actionDelete: async (req, res) => {
        try {
            const { id } = req.params;
			
			if (id != 1) {
	            await User.destroy({ where:{id: id} });
	          
	            res.status(200).json({
	                message: "Berhasil Hapus User"
	            })
			}   
			else {
				res.status(200).json({
	                message: "Superadmin Cannot Delete"
	            })
			}
        } catch (err) {
            res.status(500).json({message: err.message || 'internal server error'})
        }
    },
};
