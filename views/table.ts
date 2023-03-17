import {
  QMainWindow,
  QApplication,
  QScreen,
  QTableWidgetItem,
  QTableWidget,
  QPushButton,
} from "@nodegui/nodegui";
import { spawn } from "child_process";
import path = require("path");
import { Queries } from "../config/queries";
import { Sequelize } from "sequelize";

type data = {
  name: string;
  cpf: string;
  phone: string;
  email: string;
  id?: string;
}[];

function createTableWin(data: data, operator: number, dbConn: Sequelize) {
  const queries = new Queries(dbConn);

  const primaryScreen = QApplication.primaryScreen() as QScreen;
  const availableSize = primaryScreen.availableSize();
  const windowWidth = availableSize.width() * 0.5;
  const windowHeight = availableSize.height();

  const tableWin = new QMainWindow();
  tableWin.setWindowTitle("INDICAÇÔES");
  tableWin.resize(Math.round(windowWidth) || 500, windowHeight || 800);

  const table = new QTableWidget(data.length, 7);
  table.setHorizontalHeaderLabels([
    "",
    "NOME",
    "CPF",
    "TELEFONE",
    "E-MAIL",
    "",
    "",
  ]);

  table.setColumnWidth(0, 60);
  table.setColumnWidth(5, 60);
  table.setColumnWidth(6, 60);

  data.forEach((item, rowIndex) => {
    const id = item.id as string;
    delete item.id;

    const startButton = new QPushButton();
    startButton.setText("START");
    startButton.addEventListener("clicked", async () => {
      const args = [
        path.join(__dirname, "../keyboardMacro.py"),
        item.name,
        item.cpf.replace(/\D/g, ""),
        item.phone.replace(/\D/g, ""),
        item.email,
      ];
      const quotedArgs = args.map((arg) => `"${arg}"`);
      const command = `py ${quotedArgs.join(" ")}`;

      const pythonProcess = spawn(command, { shell: true });

      console.log(pythonProcess.pid);

      console.log(`Comando executado: ${command}`);

      pythonProcess.stderr.on("data", (data: any) => {
        console.error(`Erro ao executar o script: ${data.toString()}`);
      });

      await new Promise((resolve, reject) => {
        pythonProcess.on("exit", (code: any) => {
          if (code !== 0) {
            console.error(
              `Erro ao executar o script. Código de saída: ${code}`
            );
            reject(false);
          } else {
            console.log("Script Python executado com sucesso.");
            resolve(true);
          }
        });
      }).catch((error) => {
        console.log(error);
      });
    });
    table.setCellWidget(rowIndex, 0, startButton);

    Object.values(item).forEach((value, colIndex) => {
      if (colIndex + 1 === 2 || colIndex + 1 === 3)
        value = value.replace(/\D/g, "");
      const cell = new QTableWidgetItem(value);
      table.setItem(rowIndex, colIndex + 1, cell);
    });

    const validButton = new QPushButton();
    validButton.setText("VIÁVEL");
    validButton.addEventListener("clicked", () => {
      queries.valid(id, operator);
      const rowIndex = table.currentRow();
      table.removeRow(rowIndex);
    });
    table.setCellWidget(rowIndex, 5, validButton);

    const invalidButton = new QPushButton();
    invalidButton.setText("INVIÁVEL");
    invalidButton.addEventListener("clicked", () => {
      queries.invalid(id, operator);
      const rowIndex = table.currentRow();
      table.removeRow(rowIndex);
    });
    table.setCellWidget(rowIndex, 6, invalidButton);
  });

  tableWin.setCentralWidget(table);
  tableWin.setStyleSheet(`
  `);

  return tableWin;
}

export default createTableWin;
