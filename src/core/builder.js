/**
 * Purpose: Secure Query Compilation Framework with LIKE and ORDER capabilities
 * Description: Assembles SQL blueprints safely using parameter placeholder generation matrices and dialect compatibility constraints.
 */

import { QueryState, sanitizeIdentifier } from '../utils/helpers.js';
import { resolveOperator } from '../utils/operators.js';

export class WhereCompiler {
  constructor(dialect) {
    this.default = {
      estado: {
        __prepared: false,
        __compiled: false,
        operator: null,
        column: null,
        isolate: null
      }
    }

    this.setup(dialect);
  }

  setup(dialect) {
    this.dialect = dialect;
  }

  createContext(method, state) {
    return {
      method,
      state,
      estado: {
        ...this.default.estado,
        inClause: false,
        placeholders: []
      }
    };
  }

  escape(column) {
    const splited = column.split('.');
    const segments = splited.map(part => {
      const sanitized = sanitizeIdentifier(part);
      return this.dialect.escapeIdentifier(sanitized);
    });

    return segments.join('.');
  }

  build(clauses, method) {
    if (!clauses || typeof clauses !== 'object' || Object.keys(clauses).length === 0) {
      return { prefix: '', clauses: '', suffix: '', ending: '', params: [] };
    }

    const state = new QueryState(this.dialect);
    const context = this.createContext(method, state);
    const { conditions, limit, order } = this.resolve(clauses, context);

    let sql = conditions.length > 0 ? ` WHERE ${conditions.join(' AND ')}` : '';
    if (order) {
      sql += this.compileOrder(order);
    }
    
    if (limit.count !== null && !isNaN(limit.count)) {
      const result = this.dialect.compileLimit(limit);
      return {
        prefix: result.prefix,
        clauses: sql,
        suffix: result.suffix,
        ending: result.ending,
        params: state.params
      };
    }

    return { prefix: '', clauses: sql, suffix: '', ending: '', params: state.params };
  }

  compileAssoc(type, clauses, context) {
    const { isolate } = context.estado;
    const { conditions } = this.resolve(clauses, context);
    const result = conditions.join(` ${type.toUpperCase()} `);

    context.estado.__prepared = true;
    return isolate ? `(${result})` : result;
  }

  compileOrder(options) {
    let sql = ' ORDER BY ';

    if (typeof options === 'string') {
      return sql + `${this.escape(options)} ASC`;
    }

    if (Array.isArray(options)) {
      const segments = options.map(col => `${this.escape(col)} ASC`);
      return sql + segments.join(', ');
    }

    if (typeof options === 'object') {
      const segments = Object.entries(options).map(([col, direction]) => {
        const column = this.escape(col);

        if (Array.isArray(dir)) {
          return this.dialect.resolveOrder(column, direction);
        }

        return `${column} ${direction.toUpperCase()}`;
      });

      return sql + segments.join(', ');
    }

    return '';
  }

  prepare(value, context) {
    const { estado, state } = context;
    const { placeholders, column } = estado;

    if (Array.isArray(value)) {
      if (!placeholders.length) {
        value.forEach((val, idx) => {
          const placeholder = state.addParam(val, `${column.name}${idx + 1}`);
          placeholders.push(placeholder);
        });
      }
      
      if (estado.operator !== undefined) {
        if (estado.operator === '!') {
          estado.operator += 'IN';
        } else if (estado.operator === '~' || estado.operator === '!~') {
          if (!estado.__prepared) {
            estado.__prepared = true;
            return this.compileAssoc('OR', [value], context);
          }
        } else if (estado.operator !== '<>' && estado.operator !== '><') {
          throw new Error(`MedooJS Execution Error: Failed to proccess the '${estado.operator}' operator on value of type 'array'. Execution aborted.`);
        }
      } else {
        estado.operator = 'IN';
      }
    } else if (typeof value === 'object' && (estado.operator === '~' || estado.operator === '!~')) {
      context.estado.inClause = true;
      const { conditions } = this.resolve(value, context);

      context.estado.inClause = false;
      return conditions;
    } else {
      if (estado.operator === '!') {
        if (value === null) {
          estado.operator = 'IS NOT NULL';
        } else {
          const placeholder = state.addParam(value, column.name);

          estado.operator += '=';
          placeholders.push(placeholder);
        }
      } else if (!estado.__prepared) {
        if (value === null) {
          if (estado.operator === undefined) {
            estado.operator = 'IS NULL';
          } else {
            throw new Error(`MedooJS Execution Error: Failed to proccess the '${estado.operator}' operator on 'NULL' value. Execution aborted.`);
          }
        } else {
          const placeholder = state.addParam(value, column.name);
          placeholders.push(placeholder);
        }
      }
    }

    const result = estado.__compiled ? value : resolveOperator(estado.operator, placeholders);
    estado.__compiled = false;
    
    return result;
  }

  resolve(clauses, context) {
    const conditions = [];
    const entries = Object.entries(clauses);

    let limit = { count: null, offset: null };
    let order = null;

    for (const [key, value] of entries) {
      const upperKey = key.toUpperCase();
      context.estado.isolate = entries.length > 1;

      if (upperKey === 'AND' || upperKey === 'OR') {
        const inClause = !context.estado.inClause;
        if (inClause) {
          context.estado.inClause = inClause;
        }

        let clause = value;
        if (context.estado.operator === '~' || context.estado.operator === '!~') {
          context.estado.__prepared = true;
          clause = [value];
        }

        const result = this.compileAssoc(upperKey, clause, context);
        conditions.push(result);

        if (inClause) {
          context.estado.inClause = !inClause;
        }

        context.estado = {
          ...context.estado,
          ...this.default.estado,
          placeholders: []
        }
        continue;
      }

      if (upperKey === 'LIMIT') {
        if (context.estado.inClause) {
          throw new Error(`MedooJS Execution Error: Can't set a '${upperKey}' clause inside another WHERE clause's context! Execution aborted.`);
        }

        if (Array.isArray(value)) {
          [limit.offset, limit.count] = value;
        } else {
          limit.count = value;
        }

        limit.count = parseInt(limit.count, 10);
        continue;
      }

      if (upperKey === 'ORDER') {
        if (context.estado.inClause) {
          throw new Error(`MedooJS Execution Error: Can't set a '${upperKey}' clause inside another WHERE clause's context! Execution aborted.`);
        }

        if (context.method !== 'select' && !this.dialect.supportsOrderInWrite()) {
          throw new Error(`MedooJS Support Error: ORDER BY clause inside ${context.method.toUpperCase()} operations is not supported by the current dialect '${this.dialect.type}'. Execution aborted.`);
        }
        
        order = value;
        continue;
      }
      
      if (!context.estado.column) {
        // Mapeamento de colunas com suporte a tabelas relacionais (com ponto '.')
        const segments = key.match(/^([a-zA-Z]{2,}(?:[._][a-zA-Z]{2,})?)(?:\[(.+)\])?$/);
        if (segments === null) {
          throw new Error(`MedooJS Execution Error: Failed to proccess the WHERE clause '${key}'. Execution aborted.`);
        }


        let [rawKey, operator] = segments.slice(1);
        const varKey = rawKey.replace('.', '_');
        const escaped = this.escape(rawKey);

        context.estado.operator = operator;
        context.estado.column = {
          key,
          escaped,
          name: varKey
        };
      }

      const operations = this.prepare(value, context);
      const { operator } = context.estado;
      const escapedKey = context.estado.column?.escaped;

      if (operator === '~' || operator === '!~') {
        if (Array.isArray(operations)) {
          operations.forEach(operation => {
            conditions.push(`${escapedKey} ${operation}`);
          });
        } else {
          conditions.push(operations);
        }
      } else if (operator || operator === undefined) {
        conditions.push(`${escapedKey} ${operations}`);
      } else {
        conditions.push(operations);
      }

      context.estado = {
        ...context.estado,
        ...this.default.estado,
        placeholders: []
      }
    }

    return { conditions, limit, order };
  }
}