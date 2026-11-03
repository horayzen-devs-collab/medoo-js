
import type { ReactNode } from 'react';
import { translate } from '@docusaurus/Translate';
import CodeBlock from '@theme/CodeBlock';

export default function CodeSnippet(): ReactNode {
  const tokens = [
    translate({
      id: 'home.codeComments.importClass',
      message: '// Importar a classe Medoo.',
      description: 'Comment explaining the import of the Medoo class used to interact with the database.',
    }),
    "import { Medoo } from '@horayzen-developers/medoo-js';",
    "import mysql from 'mysql2/promise';\n",
    translate({
      id: 'home.codeComments.createPool',
      message: '// Criar um pool de ligações usando o driver.',
      description: 'Comment explaining the creation of a database connection pool using the MySQL driver.',
    }),
    "const pool = mysql.createPool(config);\n",
    translate({
      id: 'home.codeComments.initialize',
      message: '// Inicializar diretamente com o tipo de base de dados.',
      description: 'Comment explaining how to initialize a Medoo instance by specifying the database type and connection pool.',
    }),
    "const database = new Medoo({ type: 'mysql', exec: pool });\n",
    translate({
      id: 'home.codeComments.insertData',
      message: '// Inserir um novo registo.',
      description: 'Comment introducing an example of inserting a new record into the users table.',
    }),
    `database.insert('users', {
  name: 'john',
  email: 'john@email.com'
});\n`,
    translate({
      id: 'home.codeComments.getData',
      message: '// Obter dados.',
      description: 'Comment introducing an example of selecting specific columns from the users table for a record matching the given condition.',
    }),
    `const data = database.select('users', [
  'name',
  'email'
], { id: 5 });\n`,
    "console.log(data);\n",
    translate({
      id: 'home.codeComments.result',
      message: '// Resultado:',
      description: 'Comment introducing the expected output of the database query, showing the returned user data.',
    }),
    "// [{",
    "//   name: 'john',",
    "//   email: 'john@email.com'",
    "// }]"
  ];
  const snipet = tokens.join('\n');

  return (
    <CodeBlock language="js" showLineNumbers>
      {snipet}
    </CodeBlock>
  )
}