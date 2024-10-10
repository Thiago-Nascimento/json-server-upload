const jsonServer    = require("json-server")
const path          = require("path")
const fs            = require("fs")
const express       = require("express")
const multer        = require("multer")
const auth          = require("json-server-auth")

const server        = jsonServer.create()
const router        = jsonServer.router("db.json")
const middlewares   = jsonServer.defaults()

// Documentação Swagger
const swaggerUi     = require('swagger-ui-express');
const swaggerDoc    = require('./swagger.json'); // Arquivo de documentação Swagger
server.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

const port = 3000;
let imagem = ""

if (!fs.existsSync(path.join(__dirname, "uploads"))) {
    fs.mkdirSync(path.join(__dirname, "uploads"))
}

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "uploads"))
    },
    filename: (req, file, cb) => {
        imagem = Date.now() + (path.extname(file.originalname) || ".jpg")
        cb(null, imagem)
    }
})

// Configuração do Multer
let upload = multer({ storage })
server.use("/static", express.static(path.join(__dirname, "uploads")))
server.use(middlewares)
server.use(upload.any())

// Você pode definir diferentes níveis de acesso para diferentes endpoints aqui.
const rules = auth.rewriter({
    "/colaboradores*": "/660/colaboradores",
});
server.use(rules); 

server.use((req, res, next) => {
    if (req.originalUrl === "/users") {
        req.body = {...req.body, arquivo: imagem}
    }
    if(imagem !== "") {
        req.body = {...req.body, arquivo: imagem}
    }
    next()
})

server.put("/users/:id", (req, res, next) => {
    const id = parseInt(req.params.id);
    const user = router.db.get("users").find({ id }).value();

    if (!user) {
        return res.status(404).send("Usuário não encontrado");
    }

    const updatedUser = {
        ...user,
        ...req.body,
        arquivo: imagem 
    };

    // Atualize o usuário no banco de dados
    router.db.get("users").find({ id }).assign(updatedUser).write();

    res.json(updatedUser);
});

server.use(auth); 
server.db = router.db
server.use(router)

server.listen(port, () => {
    console.log("\x1b[36m%s\x1b[0m", "JSON Server executando na porta: " + port)
    console.log("\x1b[1m%s\x1b[0m", "\nRecursos disponíveis: \n")
    Object.keys(router.db.__wrapped__).forEach( recurso => console.log(`http://localhost:${port}/${recurso}`) )
    console.log(`\nhttp://localhost:${port}/static`);
})