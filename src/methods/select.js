/**
 * Purpose: SELECT Compilation Logic with Multi-Table JOIN Pipelines
 * Description: Maps table references, optional complex JOIN matrices, and array criteria parameters securely into an executable framework schema.
 */

import { formatColumns, sanitizeIdentifier } from '../utils/helpers.js';

export const compileSelect = (dialect, whereCompiler, table, ...args) => {
  const cleanTable = sanitizeIdentifier(table);
  const escapedTable = dialect.escapeIdentifier(cleanTable);
  const hasJoin = typeof args[0] === 'object' && !Array.isArray(args[0]);

  let join = null;
  let columns = '*';
  let where = {};

  if (hasJoin) {
    join = args[0];
    columns = args[1] || '*';
    where = args[2] || {};
  } else {
    columns = args[0] || '*';
    where = args[1] || {};
  }

  const column = formatColumns(columns, dialect);
  const escapeColumn = whereCompiler.escape.bind(whereCompiler);
  
  // 1. Processa a cláusula JOIN primeiro se ela existir
  let sql = '';
  if (join) {
    sql = compileJoin(escapedTable, join, dialect, escapeColumn);
  }

  // 2. Compila o WHERE coletando os prefixos e sufixos baseados no dialeto
  const { prefix, clauses, suffix, ending, params } = whereCompiler.build(where, 'select');
  const query = `SELECT ${prefix}${column} FROM ${escapedTable}${sql}${clauses}${suffix}${ending};`;
  
  return { query, params };
}

const compileJoin = (table, join, dialect, escapeColumn) => {
  let str = '';
  
  // Mapeamento corrigido estritamente de acordo com a especificação do Medoo original
  const map = {
    '[>]': 'LEFT',
    '[<]': 'RIGHT',
    '[<>]': 'FULL',
    '[><]': 'INNER'
  };

  for (const [key, value] of Object.entries(join)) {
    // Regex ajustada para capturar os colchetes opcionais no início da string da chave, ex: "[>]users"
    const match = key.match(/^(\[>\]|\[<\]|\[<>\]|\[><\])?(.+)$/);
    if (!match) continue;

    const symbol = match[1] || '[><]';
    const target = sanitizeIdentifier(match[2]);
    const operator = map[symbol];

    if (!operator) {
      throw new Error(`MedooJS Execution Error: Illegal value '${symbol}' for operator in JOIN clause! Execution aborted.`)
    }
    
    const escapedJoin = dialect.escapeIdentifier(target);
    if (typeof value === 'string') {
      // Caso simplificado usando a cláusula USING: "[>]users": "id"
      const col = dialect.escapeIdentifier(sanitizeIdentifier(value));
      str += ` ${operator} ${escapedJoin} USING (${col})`;
    } else if (typeof value === 'object') {
      // Caso explícito usando a cláusula ON: "[>]users": { "author_id": "id" }
      const [from, to] = Object.entries(value)[0];
      
      const escapedFrom = escapeColumn(from);
      const escapedTo = escapeColumn(to);
      
      str += ` ${operator} JOIN ${escapedJoin} ON ${table}.${escapedFrom} = ${escapedJoin}.${escapedTo}`;
    }
  }

  return str;
}