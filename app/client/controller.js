const Client = require("./model");
const { Op } = require('sequelize'); //digunakan untuk operator kueri.
const moment = require('moment'); // Pastikan menginstal moment untuk memudahkan manipulasi tanggal

module.exports = {
	index: async (req, res) => {
		try {
			const client = await Client.findAll();
			res.status(200).json({ data: client });
		} catch (err) {
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	countDay: async (req, res) => {
		try {
	        const today = moment().startOf('day'); // Mendapatkan waktu mulai hari ini // createdAt harus lebih besar atau sama dengan awal hari ini
	        const tomorrow = moment(today).add(1, 'days'); // Mendapatkan waktu mulai hari besok // createdAt harus kurang dari awal hari besok

	        const clientCount = await Client.count({
	        	where: {
	        		createdAt: {
	        			[Op.gte]: today.toDate(),
	        			[Op.lt]: tomorrow.toDate()
	        		}
	        	}
	        });

	        res.status(200).json({ data: clientCount });
	    } catch (err) {
	    	res.status(500).json({ message: err.message || "internal server error" });
	    }
	},
	countWeek: async (req, res) => {
		try {
	        // Mendapatkan awal dan akhir minggu ini
	        const startOfWeek = moment().startOf('isoWeek'); // Menggunakan 'isoWeek' agar minggu dimulai pada hari Senin
	        const endOfWeek = moment().endOf('isoWeek'); // Menggunakan 'isoWeek' agar minggu berakhir pada hari Minggu

	        // Menghitung jumlah client yang dibuat dalam rentang waktu minggu ini
	        const clientCount = await Client.count({
	            where: {
	                createdAt: {
	                    [Op.between]: [startOfWeek.toDate(), endOfWeek.toDate()]
	                }
	            }
	        });

	        // Mengirimkan respons dengan jumlah client
	        res.status(200).json({ data: clientCount });
	    } catch (err) {
	        // Menangani kesalahan dan mengirimkan respons kesalahan
	        res.status(500).json({ message: err.message || "internal server error" });
	    }
	},
	countWeekInMonth : async (req, res) => {
		try {
	        const startOfMonth = moment().startOf('month');
	        const endOfMonth = moment().endOf('month');

	        let currentWeekStart = startOfMonth.clone().startOf('isoWeek');
	        let currentWeekEnd = currentWeekStart.clone().endOf('isoWeek');

	        const weeklyCounts = [];

	        while (currentWeekStart.isBefore(endOfMonth)) {
	            // Pastikan minggu tidak melampaui akhir bulan
	            if (currentWeekEnd.isAfter(endOfMonth)) {
	                currentWeekEnd = endOfMonth.clone();
	            }

	            // Menghitung jumlah client dalam minggu ini
	            const clientCount = await Client.count({
	                where: {
	                    createdAt: {
	                        [Op.between]: [currentWeekStart.toDate(), currentWeekEnd.toDate()]
	                    }
	                }
	            });

	            const startOfYear = moment().startOf('year'); // Awal tahun ini
	            let currentMonthStart = startOfYear.clone().startOf('month');
	            weeklyCounts.push({
	            	year: startOfYear.format('YYYY'),
	            	month: currentMonthStart.format('MMMM'),
	                weekStart: currentWeekStart.format('YYYY-MM-DD'),
	                weekEnd: currentWeekEnd.format('YYYY-MM-DD'),
	                clientCount: clientCount
	            });

	            // Pindah ke minggu berikutnya
	            currentWeekStart = currentWeekStart.add(1, 'weeks').startOf('isoWeek');
	            currentWeekEnd = currentWeekStart.clone().endOf('isoWeek');
	        }

	        res.status(200).json({ data: weeklyCounts });
	    } catch (err) {
	        res.status(500).json({ message: err.message || "internal server error" });
	    }
	},
	countWeekInYear : async (req, res) => {
		try {
	        const startOfYear = moment().startOf('year'); // Awal tahun ini
	        const endOfYear = moment().endOf('year'); // Akhir tahun ini

	        const weeklyCounts = [];

	        let currentMonthStart = startOfYear.clone().startOf('month');
	        let currentMonthEnd = currentMonthStart.clone().endOf('month');

	        while (currentMonthStart.isBefore(endOfYear)) {
	            let currentWeekStart = currentMonthStart.clone().startOf('isoWeek');
	            let currentWeekEnd = currentWeekStart.clone().endOf('isoWeek');

	            while (currentWeekStart.isBefore(currentMonthEnd)) {
	                if (currentWeekEnd.isAfter(currentMonthEnd)) {
	                    currentWeekEnd = currentMonthEnd.clone();
	                }

	                const clientCount = await Client.count({
	                    where: {
	                        createdAt: {
	                            [Op.between]: [currentWeekStart.toDate(), currentWeekEnd.toDate()]
	                        }
	                    }
	                });

	                weeklyCounts.push({
	                	year: startOfYear.format('YYYY'),
	                    month: currentMonthStart.format('MMMM'),
	                    weekStart: currentWeekStart.format('YYYY-MM-DD'),
	                    weekEnd: currentWeekEnd.format('YYYY-MM-DD'),
	                    clientCount: clientCount
	                });

	                currentWeekStart = currentWeekStart.add(1, 'weeks').startOf('isoWeek');
	                currentWeekEnd = currentWeekStart.clone().endOf('isoWeek');
	            }

	            currentMonthStart = currentMonthStart.add(1, 'months').startOf('month');
	            currentMonthEnd = currentMonthStart.clone().endOf('month');
	        }

	        res.status(200).json({ data: weeklyCounts });
	    } catch (err) {
	        res.status(500).json({ message: err.message || "internal server error" });
	    }
	},
	countMonth: async (req, res) => {
		try {
			const startOfYear = moment().startOf('year'); // Awal tahun ini

	        // Mendapatkan awal dan akhir bulan ini
	        const startOfMonth = moment().startOf('month');
	        const endOfMonth = moment().endOf('month');

	        // Menghitung jumlah client yang dibuat dalam bulan ini
	        const clientCount = await Client.count({
	            where: {
	                createdAt: {
	                    [Op.between]: [startOfMonth.toDate(), endOfMonth.toDate()]
	                }
	            }
	        });

	        // Mengirimkan respons dengan jumlah client
	        res.status(200).json({ year: startOfYear.format('YYYY'), month: startOfMonth.format('MMMM'), data: clientCount,  });
	    } catch (err) {
	        // Menangani kesalahan dan mengirimkan respons kesalahan
	        res.status(500).json({ message: err.message || "internal server error" });
	    }
	},
	countMonthInYear: async (req, res) => {
		try {
	        const startOfYear = moment().startOf('year'); // Awal tahun ini
	        const endOfYear = moment().endOf('year'); // Akhir tahun ini

	        const monthlyCounts = [];

	        let currentMonthStart = startOfYear.clone().startOf('month');
	        let currentMonthEnd = currentMonthStart.clone().endOf('month');

	        while (currentMonthStart.isBefore(endOfYear)) {
	            // Menghitung jumlah client dalam bulan ini
	            const clientCount = await Client.count({
	                where: {
	                    createdAt: {
	                        [Op.between]: [currentMonthStart.toDate(), currentMonthEnd.toDate()]
	                    }
	                }
	            });

	            monthlyCounts.push({
	            	year: startOfYear.format('YYYY'),
	                month: currentMonthStart.format('MMMM'),
	                clientCount: clientCount
	            });

	            // Pindah ke bulan berikutnya
	            currentMonthStart = currentMonthStart.add(1, 'months').startOf('month');
	            currentMonthEnd = currentMonthStart.clone().endOf('month');
	        }

	        res.status(200).json({ data: monthlyCounts });
	    } catch (err) {
	        res.status(500).json({ message: err.message || "internal server error" });
	    }
	},
	countYear: async (req, res) => {
		try {
	        // Mendapatkan awal dan akhir tahun ini
	        const startOfYear = moment().startOf('year');
	        const endOfYear = moment().endOf('year');

	        // Menghitung jumlah client yang dibuat dalam tahun ini
	        const clientCount = await Client.count({
	            where: {
	                createdAt: {
	                    [Op.between]: [startOfYear.toDate(), endOfYear.toDate()]
	                }
	            }
	        });

	        // Mengirimkan respons dengan jumlah client
	        res.status(200).json({ year: startOfYear.format('YYYY'), data: clientCount });
	    } catch (err) {
	        // Menangani kesalahan dan mengirimkan respons kesalahan
	        res.status(500).json({ message: err.message || "internal server error" });
	    }
	},
	actionCreated: async (req, res) => {
		try {
			const { whatsapp_number } = req.body;

			const newClient = await Client.create({
				whatsapp_number
			});
			res.status(200).json({ data: newClient, status: "Client berhasil dibuat" });
		} catch (err) {
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	actionDelete: async (req, res) => {
		try {
			const { id } = req.params;

			const client = await Client.findOne({ where: { id: id } });
			if (client) {
				await Client.destroy({ where: { id: id } });

				res.status(200).json({
					message: "Berhasil Hapus Client",
				});
			} else {
				res.status(200).json({
					message: "Data client tidak ada",
				});
			}
		} catch (err) {
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	actionEdit: async (req, res, next) => {
        const { id } = req.params;
        try {
            const { whatsapp_number = ""} = req.body;
            const payload = {};
            // if (whatsapp_number.length) payload.whatsapp_number = whatsapp_number;


            // Memastikan bahwa client dengan ID tersebut ada
            let client = await Client.findOne({ where: { id: id } });

            if (client.whatsapp_number != whatsapp_number) {
            	if (whatsapp_number.length) payload.whatsapp_number = whatsapp_number;
            }

            if (!client) {
                return res.status(404).json({
                    error: 1,
                    message: "Client not found",
                });
            }

            // Mengupdate data client
            await Client.update(payload, { where: { id: id } })
                .then((updatedRows) => {
                    console.log(`${updatedRows} rows updated successfully.`);
                    res.status(200).json({
                        data: {
                            id: id,
                            whatsapp_number: payload.whatsapp_number || client.whatsapp_number
                        },
						message: "Update Client Successfully"
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
