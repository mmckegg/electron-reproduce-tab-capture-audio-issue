const { app, BrowserWindow, session } = require("electron")

app.whenReady().then(async () => {
    session.defaultSession.setDisplayMediaRequestHandler((request, callback) => {
      // Allow the tab to capture itself.
      callback({ video: request.frame, audio: request.frame })
    })

    let downloadCount = 0
    session.defaultSession.on('will-download', (event, item, webContents) => {
        // Set the save path, making Electron not to prompt a save dialog.
        console.log(`Downloading ${item.getFilename()}`)
        item.setSavePath(item.getFilename())
        item.addListener('done', () => {
            downloadCount += 1
            if (downloadCount == 2) {
                process.exit()
            }
        })
    })

    const page1 = new BrowserWindow({webPreferences: {offscreen: true}})
    page1.loadFile("page1.html")
    page1.webContents.setFrameRate(30)
    page1.webContents.session
    
    setTimeout(() => {
        const page2 = new BrowserWindow({webPreferences: {offscreen: true}})
        page2.loadFile("page2.html")
        page2.webContents.setFrameRate(30)
    }, 5000)
})