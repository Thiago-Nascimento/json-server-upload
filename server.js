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

// Configurar as regras de autenticação
// Você pode definir diferentes níveis de acesso para diferentes endpoints aqui.
const rules = auth.rewriter({
    // Apenas usuários autenticados podem acessar o endpoint /secure-endpoint
    "/colaboradores*": "/660/colaboradores",
  });

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
server.use(rules); // Aplica as regras
server.use(auth); // Aplica o auth middleware
server.use(router); // Roteador padrão do json-server


server.use((req, res, next) => {
    if (req.originalUrl === "/users") {
        req.body = {...req.body, user_img: imagem}
    }

    next()
})

server.use(auth)

server.put("/users/:id", (req, res, next) => {
    // Aqui você pode tratar a requisição PUT para atualizar os dados do usuário,
    // incluindo a imagem, se necessário.
    const id = parseInt(req.params.id);
    const user = router.db.get("users").find({ id }).value();

    if (!user) {
        return res.status(404).send("Usuário não encontrado");
    }

    // Atualize os campos do usuário conforme necessário, incluindo a imagem
    const updatedUser = {
        ...user,
        ...req.body,
        user_img: imagem // Aqui você pode obter a imagem do req.body ou do req.files, dependendo de como está sendo enviado o arquivo no form-data
    };

    // Atualize o usuário no banco de dados
    router.db.get("users").find({ id }).assign(updatedUser).write();

    res.json(updatedUser);
});

server.db = router.db
server.use(router)

server.listen(port, () => {
    console.log("\x1b[36m%s\x1b[0m", "JSON Server executando na porta: " + port)
    console.log("\x1b[1m%s\x1b[0m", "\nRecursos disponíveis: \n")

    Object.keys(router.db.__wrapped__).forEach( recurso => console.log(`http://localhost:${port}/${recurso}`) )

    console.log(`\nhttp://localhost:${port}/static`);

})