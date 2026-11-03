```markdown
 __  __          _                 _ ____  
|  \/  | ___  __| | ___   ___     | / ___| 
| |\/| |/ _ \/ _` |/ _ \ / _ \ _  | \___ \ 
| |  | |  __/ (_| | (_) | (_) | |_| |___) |
|_|  |_|\___|\__,_|\___/ \___/ \___/|____/

```

O MedooJS é a forma mais simples, leve e limpa de interagir com bancos de dados em [Node.js](https://nodejs.org). Inspirado no aclamado [Medoo](https://medoo.in) do PHP, ele elimina a complexidade e o peso dos ORMs tradicionais, permitindo a manipulação de dados usando apenas objetos JavaScript puros.

Desenvolvido para ser agnóstico e seguro por padrão, ele se conecta diretamente ao driver, garantindo proteção total contra SQL Injection sem adicionar peso ao projeto.

---

## Como Funciona?

Esqueça queries gigantescas em formato de texto ou configurações complexas de modelos. O MedooJS reduz o código ao essencial:

```javascript
// Import the Medoo Class.
import { Medoo } from '@horayzen-developers/medoo-js';
import mysql from 'mysql2/promise';

// Criar uma pool de conexão usando o driver
const pool = mysql.createPool(config)

// Inicialização direta com o tipo do seu banco
const database = new Medoo({ type: 'mysql', exec: pool });
 
// Inserir um novo registro
database.insert('conta', {
  nome: 'john',
  email: 'john@email.com'
});
 
// Buscar registro.
const registro = database.select('conta', [
  'nome',
  'email'
], { id: 5 });
 
console.log(registro)
 
// [{
//   "nome" : "john",
//   "email" : "john@email.com"
// }]

```

---

## Suporte para Múltiplos Bancos de Dados

Não importa a infraestrutura. O MedooJS gera a sintaxe exata e segura para o motor escolhido de forma nativa:

* MariaDB e MySQL
* Microsoft SQL Server (MSSQL)
* Oracle
* PostgreSQL
* SQLite

---

## Segurança Transparente

Toda entrada de dados passada pelos objetos é convertida automaticamente em Prepared Statements nativos doq banco. Além disso, os nomes de tabelas e colunas passam por uma camada automática de higienização contra invasores, anulando qualquer tentativa de SQL Injection de forma invisível e sem perda de performance.

---

## Instalação Rápida

```bash

npm install @horayzen-developers/medoo-js

```

---

## Licença 

Este projeto está sob a licença [MIT](LICENSE).