/**
 * Purpose: Secure Record Insertion Compiler
 * Description: Generates parameters schemas mapping inputs safely via structured array positions.
 */
import { QueryState, sanitizeIdentifier } from '../utils/helpers.js';

export const compileInsert = (dialect, table, data, primary) => {
  if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
    throw new Error('MedooJS Error: Insert payload structure maps empty entries list.');
  }

  const cleanTable = sanitizeIdentifier(table);
  const escapedTable = dialect.escapeIdentifier(cleanTable);
  const state = new QueryState(dialect);
  
  const columns = Object.keys(data).map(col => sanitizeIdentifier(col)).filter(col => col.length > 0);
  const escapedColumns = columns.map(col => dialect.escapeIdentifier(col)).join(', ');
  const placeholders = columns.map(col => state.addParam(data[col], col)).join(', ');

  let returning;
  if (typeof primary === 'string') {
    returning = dialect.applyReturning(primary);
  }

  const query = `INSERT INTO ${escapedTable} (${escapedColumns})${returning?.prefix || ''} VALUES (${placeholders})${returning?.suffix || ''};`;
  return { query, params: state.params };
}