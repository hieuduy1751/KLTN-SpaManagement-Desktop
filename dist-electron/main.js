"use strict";const n=require("electron"),o=require("node:path");process.env.DIST=o.join(__dirname,"../dist");process.env.VITE_PUBLIC=n.app.isPackaged?process.env.DIST:o.join(process.env.DIST,"../public");let e;const s=process.env.VITE_DEV_SERVER_URL;function i(){e=new n.BrowserWindow({icon:o.join(process.env.VITE_PUBLIC,"electron-vite.svg"),webPreferences:{preload:o.join(__dirname,"preload.js")},width:1200,height:800}),e.webContents.on("did-finish-load",()=>{e==null||e.webContents.send("main-process-message",new Date().toLocaleString())}),s?e.loadURL(s):e.loadFile(o.join(process.env.DIST,"index.html"))}n.app.on("window-all-closed",()=>{process.platform!=="darwin"&&(n.app.quit(),e=null)});n.app.on("activate",()=>{n.BrowserWindow.getAllWindows().length===0&&i()});n.app.whenReady().then(i);
