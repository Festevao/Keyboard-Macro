import { Sequelize, DataTypes } from "sequelize";

export function _lead(sequelize: Sequelize, dataTypes: typeof DataTypes) {
  return sequelize.define(
    "lead",
    {
      id: {
        type: dataTypes.CHAR(36),
        allowNull: false,
        primaryKey: true,
      },
      cpf: {
        type: dataTypes.STRING(255),
        allowNull: true,
      },
      phone: {
        type: dataTypes.STRING(255),
        allowNull: true,
      },
      name: {
        type: dataTypes.STRING(255),
        allowNull: true,
      },
      email: {
        type: dataTypes.STRING(255),
        allowNull: true,
      },
      afiliadoId: {
        type: dataTypes.CHAR(36),
        allowNull: false,
        references: {
          model: "afiliados",
          key: "id",
        },
      },
      bankRecommended: {
        type: dataTypes.DATE,
        allowNull: true,
      },
      bankRegistered: {
        type: dataTypes.DATE,
        allowNull: true,
      },
      bankAccountCreated: {
        type: dataTypes.DATE,
        allowNull: true,
      },
      keyId: {
        type: dataTypes.CHAR(36),
        allowNull: true,
        references: {
          model: "key",
          key: "id",
        },
      },
      comission: {
        type: dataTypes.DOUBLE,
        allowNull: true,
      },
      operator: {
        type: dataTypes.INTEGER,
        allowNull: true,
      },
      bankAccountQualified: {
        type: dataTypes.DATE,
        allowNull: true,
      },
      comissionQualified: {
        type: dataTypes.DOUBLE,
        allowNull: true,
      },
      unviable: {
        type: dataTypes.INTEGER,
        allowNull: true,
      },
      repeat: {
        type: dataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      pulledBy: {
        type: dataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      tableName: "lead",
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "afiliadoId",
          using: "BTREE",
          fields: [{ name: "afiliadoId" }],
        },
        {
          name: "keyId",
          using: "BTREE",
          fields: [{ name: "keyId" }],
        },
      ],
    }
  );
}
