import {
  QMainWindow,
  QWidget,
  FlexLayout,
  QPushButton,
  QApplication,
  QScreen,
  QLineEdit,
  QLabel,
} from "@nodegui/nodegui";
import createTableWin from "../views/table";
import createErrorWin from "../views/error";
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

const primaryScreen = QApplication.primaryScreen() as QScreen;
const availableSize = primaryScreen.availableSize();
const windowWidth = availableSize.width() * 0.8;
const windowHeight = availableSize.height() * 0.8;

const win = new QMainWindow();
win.setWindowTitle("INICIO");
win.resize(windowWidth || 500, windowHeight || 800);

const centralWidget = new QWidget();
centralWidget.setObjectName("myroot");

const numCharsLabel = new QLabel();
numCharsLabel.setObjectName("labelOperator");
numCharsLabel.setText("Id de operador:");

const numCharsInput = new QLineEdit();
numCharsInput.setObjectName("numCharsInput");

const button = new QPushButton();
button.setText("COMEÇAR");
button.addEventListener("clicked", async () => {
  await dbConn
    .authenticate()
    .then(async () => {
      await dbConn.sync();
      if (Number.isNaN(parseInt(numCharsInput.text())))
        throw new Error("O id de operador é inválido !");
      showTable(parseInt(numCharsInput.text()));
    })
    .catch(async (error) => {
      const errorString = error.toString().toUpperCase();
      const errorWin = createErrorWin(errorString);
      errorWin.show();
      (global as any).win.close;
      (global as any).win = errorWin;
    });
});

const rootLayout = new FlexLayout();
centralWidget.setLayout(rootLayout);

rootLayout.addWidget(numCharsLabel);
rootLayout.addWidget(numCharsInput);
rootLayout.addWidget(button);

win.setCentralWidget(centralWidget);
win.setStyleSheet(
  `
    #myroot {
      width: '100%';
      background-color: white;
      height: '100%';
      align-items: 'center';
      justify-content: 'center';
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

    QPushButton {
      width: 100px;
      height: 25px;
      border-radius: 8px;
      border: 1px solid black;
      background-color: #bababa;
      font-size: 16px;
    }

    QPushButton:hover {
      background-color: #e6e6e6;
    }
  `
);
win.show();

(global as any).win = win;
