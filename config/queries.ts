import { initModels } from "./models/init-models";
import { Sequelize, Op } from "sequelize";

type data = {
  name: string;
  cpf: string;
  phone: string;
  email: string;
  id: string;
}[];

export class Queries {
  private tables;
  constructor(dbConn: Sequelize) {
    this.tables = initModels(dbConn);
  }

  async getUsers(operatorId: number): Promise<data> {
    return JSON.parse(
      JSON.stringify(
        await this.tables.lead.findAll({
          attributes: ["name", "cpf", "phone", "email", "id"],
          where: {
            bankRecommended: null,
            pulledBy: {
              [Op.or]: [operatorId, null],
            },
          },
          order: [
            ["pulledBy", "DESC"],
            ["createdAt", "ASC"],
          ],
          raw: true,
          limit: 3,
          pulledBy: operatorId,
          hooks: true,
        } as any)
      )
    );
  }

  async valid(id: string, operator: number): Promise<void> {
    await this.tables.lead.update(
      { unviable: 0, bankRecommended: Date.now(), operator },
      {
        where: {
          id,
        },
      }
    );
  }

  async invalid(id: string, operator: number): Promise<void> {
    await this.tables.lead.update(
      { unviable: 1, bankRecommended: Date.now(), operator },
      {
        where: {
          id,
        },
      }
    );
  }
}
