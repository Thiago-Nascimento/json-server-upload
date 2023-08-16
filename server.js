// Endereço da imagem
// http://localhost:3000/static/[nomedaimagem]

const jsonServer = require("json-server")
const server = jsonServer.create()

const router = jsonServer.router("db.json")
const middlewares = jsonServer.defaults()

const path = require("path")
const fs = require("fs")
const express = require("express")
const multer = require("multer")

const auth = require("json-server-auth")

const port = 3000;
let imagem = ""

if (!fs.existsSync(path.join(__dirname, "img"))) {
    fs.mkdirSync(path.join(__dirname, "img"))
}

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "img"))
    },
    filename: (req, file, cb) => {
        imagem = Date.now() + (path.extname(file.originalname) || ".jpg")
        cb(null, imagem)
    }
})

let upload = multer({ storage })

server.use("/static", express.static(path.join(__dirname, "img")))

server.use(middlewares)

server.use(upload.any())

server.use((req, res, next) => {
    if (req.originalUrl === "/users") {
        req.body = {...req.body, user_img: imagem}
    }

    next()
})

server.use(auth)

server.db = router.db
server.use(router)

server.listen(port, () => {
    console.log("\x1b[36m%s\x1b[0m", "JSON Server executando na porta: " + port)
    console.log("\x1b[1m%s\x1b[0m", "\nRecursos disponíveis: ")
    console.log("\nhttp://localhost:3000/users")
    console.log("http://localhost:3000/servicos\n")
})