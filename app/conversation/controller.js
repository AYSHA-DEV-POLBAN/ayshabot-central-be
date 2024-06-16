const Conversation = require("./model");
const { logHistoryCreated } = require('../logHistory/controller');
const { Op } = require('sequelize'); //digunakan untuk operator kueri.
const moment = require('moment'); // Pastikan menginstal moment untuk memudahkan manipulasi tanggal

module.exports = {
	index: async (req, res) => {
		try {
			const conversation = await Conversation.findAll();
			res.status(200).json({ data: conversation });
		} catch (err) {
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	getConversationById: async (req, res) => {
		try {
			const { id } = req.params;
			const conversation = await Conversation.findOne({ where: { id: id } });
			logHistoryCreated(req.user.id, null, Conversation.getTableName().tableName, "GET DATA", JSON.stringify(conversation, null, 4) + " --> " + req.user.email, "Conversation.findOne({ where: { id: id } })");
			res.status(200).json({ data: conversation });
		} catch (err) {
			logHistoryCreated(req.user.id, null, Conversation.getTableName().tableName, "ERROR", "-", err.message || "internal server error");
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	countDay: async (req, res) => {
		try {
	        const today = moment().startOf('day'); // Mendapatkan waktu mulai hari ini // createdAt harus lebih besar atau sama dengan awal hari ini
	        const tomorrow = moment(today).add(1, 'days'); // Mendapatkan waktu mulai hari besok // createdAt harus kurang dari awal hari besok

	        const conversationCount = await Conversation.count({
	        	where: {
	        		createdAt: {
	        			[Op.gte]: today.toDate(),
	        			[Op.lt]: tomorrow.toDate()
	        		}
	        	}
	        });

	        data = {};
	        data.conversationCount = conversationCount;
	        data.today = today;
	        data.tomorrow = tomorrow;

	        res.status(200).json({ data: data });
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
	        const conversationCount = await Conversation.count({
	            where: {
	                createdAt: {
	                    [Op.between]: [startOfWeek.toDate(), endOfWeek.toDate()]
	                }
	            }
	        });

	        data = {};
	        data.conversationCount = conversationCount;
	        data.startOfWeek = startOfWeek;
	        data.endOfWeek = endOfWeek;

	        // Mengirimkan respons dengan jumlah client
	        res.status(200).json({ data: data });
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
	            const conversationCount = await Conversation.count({
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
	                conversationCount: conversationCount
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

	                const conversationCount = await Conversation.count({
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
	                    conversationCount: conversationCount
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
	        const conversationCount = await Conversation.count({
	            where: {
	                createdAt: {
	                    [Op.between]: [startOfMonth.toDate(), endOfMonth.toDate()]
	                }
	            }
	        });

	        // Mengirimkan respons dengan jumlah client
	        res.status(200).json({ year: startOfYear.format('YYYY'), month: startOfMonth.format('MMMM'), data: conversationCount,  });
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
	            const conversationCount = await Conversation.count({
	                where: {
	                    createdAt: {
	                        [Op.between]: [currentMonthStart.toDate(), currentMonthEnd.toDate()]
	                    }
	                }
	            });

	            monthlyCounts.push({
	            	year: startOfYear.format('YYYY'),
	                month: currentMonthStart.format('MMMM'),
	                conversationCount: conversationCount
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
	        const conversationCount = await Conversation.count({
	            where: {
	                createdAt: {
	                    [Op.between]: [startOfYear.toDate(), endOfYear.toDate()]
	                }
	            }
	        });

	        // Mengirimkan respons dengan jumlah client
	        res.status(200).json({ year: startOfYear.format('YYYY'), data: conversationCount });
	    } catch (err) {
	        // Menangani kesalahan dan mengirimkan respons kesalahan
	        res.status(500).json({ message: err.message || "internal server error" });
	    }
	},
	actionCreated: async (req, res) => {
		try {
			const { client_id, question_client,  response_system, chunk_relevant, bill} = req.body;

			const newConversation = await Conversation.create({
				client_id, question_client, response_system, chunk_relevant, bill
			});
			res.status(200).json({ data: newConversation, status: "Conversation berhasil dibuat" });
		} catch (err) {
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	actionDelete: async (req, res) => {
		try {
			const { id } = req.params;

			const conversation = await Conversation.findOne({ where: { id: id } });
			if (conversation) {
				await Conversation.destroy({ where: { id: id } });

				res.status(200).json({
					message: "Berhasil Hapus Conversation",
				});
			} else {
				res.status(200).json({
					message: "Data Conversation tidak ada",
				});
			}
		} catch (err) {
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
};
