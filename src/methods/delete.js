/**
 * Purpose: Secure Deletion Compilation
 * Description: Sets up record purge operations under sanitized key spaces cleanly.
 */

import { sanitizeIdentifier } from '../utils/helpers.js';

export const compileDelete = (dialect, whereCompiler, table, where = {}) => {
  const cleanTable = sanitizeIdentifier(table);
  const escapedTable = dialect.escapeIdentifier(cleanTable);
  const { clauses, params } = whereCompiler.build(where, 'delete');

  const query = `DELETE FROM ${escapedTable}${clauses};`;
  return { query, params };
}