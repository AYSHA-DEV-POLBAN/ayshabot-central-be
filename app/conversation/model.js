const { DataTypes } = require("sequelize");
const sequelize = require("../../database/sequelize");

const Client = require("../client/model");

const Conversation = sequelize.define(
	"Conversation",
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		client_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Client,
				key: 'id'
			}
		},
		question_client: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		response_system: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		chunk_relevant: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		bill: {
			type: DataTypes.DECIMAL(25, 10),
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
	},
	{
		tableName: "conversation",
		schema: "public",
	}
);

// Definisikan asosiasi
Conversation.belongsTo(Client, { foreignKey: 'client_id' });

module.exports = Conversation;
