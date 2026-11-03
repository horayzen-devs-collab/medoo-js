/**
 * Purpose: Secure UPDATE Compilation Logic
 * Description: Assembles mutation workflows pairing assignments and constraint lists cleanly.
 */

import { QueryState, sanitizeIdentifier } from '../utils/helpers.js';

export const compileUpdate = (dialect, whereCompiler, table, data, where = {}) => {
  const cleanTable = sanitizeIdentifier(table);
  const escapedTable = dialect.escapeIdentifier(cleanTable);
  
  const state = new QueryState(dialect);
  const assignments = [];

  for (const [key, value] of Object.entries(data)) {
    const cleanKey = sanitizeIdentifier(key);
    if (!cleanKey) {
      continue;
    }
    
    const escapedKey = dialect.escapeIdentifier(cleanKey);
    const placeholder = state.addParam(value, key);
    assignments.push(`${escapedKey} = ${placeholder}`);
  }

  const { clauses, params: whereParams } = whereCompiler.build(where, 'update');
  const query = `UPDATE ${escapedTable} SET ${assignments.join(', ')}${clauses};`;

  return { query, params: [...state.params, ...whereParams] };
}