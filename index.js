const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser'); 
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = 3000; // Porta em que a API vai rodar

const connection = mysql.createConnection({
    host: 'programadordesistemas.mysql.database.azure.com',
    user: 'usuario_quiz',
    password: 'Quiz@123',
    database: 'gedean'
});
  
connection.connect((err) => {
    if (err) throw err;
    console.log('Conexão com o banco de dados estabelecida!');
});
  
app.get('/', (req, res) => {    
    res.send('Alô mundo!');    
});

app.get('/perguntas', (req, res) => {
  connection.query('SELECT * FROM perguntas', (err, rows) => {
    if (err) throw err;
    const perguntas = [];
    rows.forEach(row => {
      const respostas = [row.resposta1, row.resposta2, row.resposta3, row.resposta4, row.resposta5].filter(resposta => resposta);
      perguntas.push({
        "Pergunta": `${row.id}. ${row.pergunta}`,
        "Respostas": respostas,
        "alternativa_correta": row.alternativacorreta
      });
    });
    res.send(perguntas);
  });
});

app.get('/usuarios', (req, res) => {
    connection.query('SELECT * FROM usuarios', (err, rows) => {
      if (err) throw err;
      res.send(rows);
    });
});

app.post('/login', (req, res) => {
  const login = req.body.login;
  const senha = req.body.senha;
  connection.query('SELECT id, nome, login FROM usuarios WHERE login = ? AND senha = MD5(?)', [login, senha], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      res.status(200).send(result);
    } else {
      res.status(401).send('Credenciais inválidas');
    }
  });
});

app.get('/perguntas/:id', (req, res) => {
    const id = req.params.id;
    connection.query('SELECT * FROM perguntas WHERE id = ?', [id], (err, rows) => {
      if (err) throw err;
      res.send(rows);
    });
  });

// Inicia o servidor na porta 3000
app.listen(port, () => {
  console.log('Servidor iniciado na porta 3000');
});