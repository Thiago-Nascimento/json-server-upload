<h1 align="center">json-server-upload</h1>

<p align="center">🚀 Projeto que utiliza o json-server para mockar uma REST API, e possui a funcionalidade de upload de imagem, e ainda disponibilza essa imagem.</p><br>

### Descrição
Este projeto utiliza como base o json-server e o json-server-auth

### Pré-requisitos e Como utilizar

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
[Git](https://git-scm.com), [Node.js](https://nodejs.org/en/). 
Além disto é bom ter um editor para trabalhar com o código como [VSCode](https://code.visualstudio.com/)

### 👨🏽‍💻 Rodando o Back End (servidor)

```bash
# Clone este repositório
$ git clone https://github.com/Thiago-Nascimento/json-server-upload

# Acesse a pasta do projeto no terminal/cmd/bash
$ cd json-server-upload

# Instale as dependências
$ npm install

# Execute a aplicação 
$ npm start

# O servidor inciará na porta:3000 - acesse <http://localhost:3000>
```

# Login
> Para realizar login, é preciso usar o endpoint:

```bash
POST /login
{
  "email": "olivier@mail.com",
  "password": "bestPassw0rd"
}
```

# Users
> Para cadastrar os usuários com imagem, utilize pelo menos os campos abaixo, com corpo do tipo form-data:
```bash
POST /users
    {
      "email": "seuemail@email.com",
      "password": "suasenha",
      "user_img": "1713478562094.jpg" 
    }
```

# Imagem
> Qualquer imagem que for enviada estará disponível no endpoint <br>
http://localhost:3000/static/nomedaimagem.png