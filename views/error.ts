import {
  FlexLayout,
  QLabel,
  QPushButton,
  QMainWindow,
  QWidget,
  QApplication,
  QScreen,
  QLineEdit,
} from "@nodegui/nodegui";

import createTableWin from "../views/table";
import { dbConn } from "../config/dbConn";
import { Queries } from "../config/queries";

async function showTable(operador: number) {
  const queries = new Queries(dbConn);
  const tableWin = createTableWin(
    await queries.getUsers(operador),
    operador,
    dbConn
  );
  tableWin.show();
  (global as any).win.close();
  (global as any).win = tableWin;
  setTimeout(showTable, 60000, operador);
}

function createErrorWin(errorMessage: string) {
  const primaryScreen = QApplication.primaryScreen() as QScreen;
  const availableSize = primaryScreen.availableSize();
  const windowWidth = availableSize.width() * 0.8;
  const windowHeight = availableSize.height() * 0.8;

  const errorWin = new QMainWindow();
  errorWin.setWindowTitle("ERRO");
  errorWin.resize(windowWidth || 500, windowHeight || 800);

  const centralWidget = new QWidget();
  centralWidget.setObjectName("errorRoot");

  const title = new QLabel();
  title.setText("OPS, OCORREU UM ERRO!");
  title.setObjectName("title");

  const subtitle = new QLabel();
  subtitle.setText(errorMessage);
  subtitle.setObjectName("subtitle");

  const numCharsLabel = new QLabel();
  numCharsLabel.setObjectName("labelOperator");
  numCharsLabel.setText("Id de operador:");

  const numCharsInput = new QLineEdit();
  numCharsInput.setObjectName("numCharsInput");

  const retryButton = new QPushButton();
  retryButton.setText("TENTAR NOVAMENTE");
  retryButton.setObjectName("retryButton");
  retryButton.addEventListener("clicked", async () => {
    await dbConn
      .authenticate()
      .then(async () => {
        await dbConn.sync();
        if (Number.isNaN(parseInt(numCharsInput.text())))
          throw new Error("O id de operador é inválido !");
        showTable(parseInt(numCharsInput.text()));
      })
      .catch(async (error) => {
        const newErrorWin = createErrorWin(error);
        newErrorWin.show();
        (global as any).win.close();
        (global as any).win = newErrorWin;
      });
  });

  const container = new FlexLayout();
  container.setObjectName("container");

  centralWidget.setLayout(container);

  container.addWidget(title);
  container.addWidget(subtitle);
  container.addWidget(numCharsLabel);
  container.addWidget(numCharsInput);
  container.addWidget(retryButton);

  errorWin.setCentralWidget(centralWidget);
  errorWin.setStyleSheet(`
    #errorRoot {
      width: '100%';
      background-color: white;
      height: '100%';
      align-items: 'center';
      justify-content: 'center';
    }

    #retryButton {
      margin-top: 20px;
    }

    #labelOperator {
      font-size: 20px;
      font-weight: bold;
    }

    #numCharsInput {
      width: "10%";
      height: 70px;
      margin: 20px;
      background-color: white;
      border: 1px solid black;
      border-radius: 8px;
    }

    #container {
      background-color: #f2f2f2;
    }

    #title {
      font-size: 30px;
      font-weight: bold;
      margin-bottom: 20px;
    }

    #subtitle {
      font-size: 20px;
      margin-bottom: 20px;
    }

    QPushButton {
      padding: 10px;
      border-radius: 8px;
      background-color: #8d0000;
      color: white;
      font-size: 16px;
      border: 1px solid black;
    }
  `);

  return errorWin;
}

export default createErrorWin;
