import { Sequelize, DataTypes, Op } from "sequelize";
import { _lead } from "./lead";

type Data = {
  name: string;
  cpf: string;
  phone: string;
  email: string;
  id: string;
};

function initModels(sequelize: Sequelize) {
  const lead = _lead(sequelize, DataTypes);

  lead.afterFind((instance, options) => {
    if (instance && (options as any).pulledBy !== false) {
      const ids = (instance as unknown as Data[]).map((element) => {
        return { id: (element as any).id };
      });
      lead.update(
        { pulledBy: (options as any).pulledBy },
        {
          where: {
            [Op.or]: [
              {
                pulledBy: {
                  [Op.ne]: (options as any).pulledBy,
                },
              },
              {
                pulledBy: null,
              },
            ],
            [Op.or]: ids,
          },
        }
      );
    }
  });

  return {
    lead,
  };
}

export { initModels };
