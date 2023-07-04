const { app, BrowserWindow } = require("electron");

let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 700,
		webPreferences: {
			nodeIntegration: true
		}
	});

	mainWindow.loadURL("https://tasktrailapp.com/login");
	mainWindow.removeMenu();
	mainWindow.on("closed", function () {
		mainWindow = null;
	});
}

app.on("resize", function (e, x, y) {
	mainWindow.setSize(x, y);
});

app.whenReady().then(() => {
	createWindow();

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

app.on("window-all-closed", function () {
	if (process.platform !== "darwin") {
		app.quit();
	}
});
