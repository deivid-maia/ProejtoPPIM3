import express from 'express';
import path from 'path'; //lidar com as urls 

const porta = 3000;
const host = '0.0.0.0';
var listaUsuarios = [];

function processaCadastroUsuario(requisicao, resposta){
    //extrair os dados do corpo da requisição, além de validar os dados

    const dados = requisicao.body;
    let conteudoResposta = '';
    // é necessário validar os dados enviados
    // a validação dos dados é de responsabilidade da aplicação servidora
    if (!(dados.nome && dados.telefone && dados.email && dados.senha
    && dados.confirmarSenha)){
        //estão faltando dados do usuário
        conteudoResposta = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Formulário de Inscrição</title>
            <link rel="stylesheet" href="estilo.css">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
            integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        </head>
        <body>
            <div class="container">
                <form action='/cadastroUsuario' method="POST">
                    <fieldset>
                        <h2>Formulário de Inscrição</h2>
                        <div class="form-group">
                            <label for="nome">Nome</label>
                            <input type="text" id="nome" name="nome" value="${dados.nome}" required>
                        </div>
        `;

        if(!dados.nome){
            conteudoResposta += `
                    <div>
                        <p class="text-danger">Por favor, informe o nome !</p>
                    </div>`;
        }

        conteudoResposta +=`
                    <div class="form-group">
                        <label for="telefone">Telefone</label>
                        <input type="tel" id="telefone" name="telefone" value="${dados.telefone}" required>
                    </div> `;
        if(!dados.telefone){
            conteudoResposta +=`
                    <div>
                        <p class="text-danger">Por favor, informe o telefone !</p>
                    </div>`;
              
        }

        conteudoResposta +=`
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" value="${dados.email}" required>
                    </div>`;
        if(!dados.email){
            conteudoResposta +=`
                    <div>
                        <p class="text-danger">Por favor, informe o e-mail !</p>
                    </div>`;
              
        }

        conteudoResposta +=`
                    <div class="form-group">
                         <label for="senha">Senha</label>
                        <input type="password" id="senha" name="senha" value="${dados.senha}" required>
                    </div>`;
        if(!dados.senha){
            conteudoResposta +=`
                    <div>
                        <p class="text-danger">Por favor, informe a senha !</p>
                    </div>`;
              
        }

        conteudoResposta +=`
                    <div class="form-group">
                        <label for="confirmar-senha">Confirmar Senha</label>
                        <input type="password" id="confirmarSenha" name="confirmarSenha" value="${dados.confirmarSenha}" required>
                    </div>`;
        if(!dados.confirmarSenha){
            conteudoResposta +=`
                    <div>
                        <p class="text-danger">Por favor, confirme a senha !</p>
                    </div>`;
              
        }

        conteudoResposta += `
                    <button type="submit">Inscrever-se</button>
                            
                        </fieldset>
                    </form>
                </div>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
                crossorigin="anonymous"></script>
            </body>
            </html>`; 

        resposta.end(conteudoResposta);
        
    }
    else{

    const usuario = {
        nome: dados.nome,
        telefone: dados.telefone,
        email: dados.email,
        senha: dados.senha,
        confirmarSenha: dados.confirmarSenha,
    }

    //adiciona um novo usuario na lista de usuarios já cadastrados
    listaUsuarios.push(usuario);
    //retornar a lista de usuarios
    let conteudoResposta = `
    <!DOCTYPE html>
    <head>
        <meta charset="UTF-8">
        <title> Menu do sistema </title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    </head>
    <body>
        <h1>Lista de usuários cadastrados</h1>
        <table class="table table-dark table-hover">
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Telefone</th>
                    <th>Email</th>
                    <th>Senha</th>
                    <th>Confirmar senha</th>
                </tr>
            </thead>
            <tbody>`;
            
    for(const usuario of listaUsuarios){
         conteudoResposta += `
                        <tr>
                            <td>${usuario.nome}</td>
                            <td>${usuario.telefone}</td>
                            <td>${usuario.email}</td>
                            <td>${usuario.senha}</td>
                            <td>${usuario.confirmarSenha}</td>
                        </tr>
                    
                    `;
    }
 
    conteudoResposta += `
             </tbody>
        </table>
        <a class="btn btn-primary" href="/" role="button">Voltar ao menu</a>
        <a class="btn btn-primary" href="/cadastroUsuario.html" role="button">Continuar cadastrando</a>
    </body>
    </html> `;
        resposta.end(conteudoResposta);
    } // final do if/else de validação
}                    

const app = express();

// ativar a extensão que manipula requisicoes HTTP
//opcao false ativa a extensão
// opcap true ativa a extensão qs(manipula objetos(lista, aninhados))
app.use(express.urlencoded({extended: true}));

//indicando para a aplicação como servir arquivos estáticos localizados na pasta 'paginas'
app.use(express.static(path.join(process.cwd(),'paginas'))); // junto com a biblioteca path, faz a correção da localização da pasta pro deploy no vercel

app.get('/', (requisicao, resposta) => {
    resposta.end(`
        <!DOCTYPE html>
            <head>
                <meta charset="UTF-8">
                <title> Menu do sistema </title>
            </head>
            <body>
                <h1> MENU </h1>
                <ul>
                    <li> <a href="/cadastroUsuario.html"> Cadastrar Usuário </a> </li>
                </ul>
            </body>
        </html>
        
    `);
})

//rota para processar o cadastro de usuarios endpoint = '/cadastroUsuario'
app.post('/cadastroUsuario', processaCadastroUsuario);


app.listen(porta, host, () => {
    console.log(`Servidor executando na url http://${host}:${porta}`);

});