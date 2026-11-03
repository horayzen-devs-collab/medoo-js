/**
 * Purpose: Dialect Strategy Layer
 * Description: Manages identifier enclosing syntax and binds execution routing rules for target databases.
 */

import { sanitizeIdentifier } from '../utils/helpers.js';

const DIALECTS = {
  MARIADB: 'mariadb',
  MSSQL: 'mssql',
  MYSQL: 'mysql',
  ORACLE: 'oracle',
  POSTGRESQL: 'postgresql',
  SQLITE: 'sqlite'
};

export class Dialect {
  constructor(type) {
    this.setup(type);
  }

  setup(type) {
    const dialect = type.toLowerCase();
    const supported = Object.values(DIALECTS);

    if (supported.includes(dialect)) {
      this.type = dialect;
    } else {
      throw new Error("MedooJS Configuration Error: Illegal value for config field 'type' in Dialect!")
    }
  }

  /**
   * Encloses a pre-sanitized database entity identifier name in dialect-safe markers.
   * @param {string} identifier - Internal structural entity label string.
   * @returns {string} Secure, escaped dialect string identifier.
   */
  escapeIdentifier(identifier) {
    if (identifier === '*') return '*';
    const clean = sanitizeIdentifier(identifier);
    
    switch (this.type) {
      case DIALECTS.POSTGRESQL:
      case DIALECTS.SQLITE:
      case DIALECTS.ORACLE:
        return `"${clean}"`;
      case DIALECTS.MSSQL:
        return `[${clean}]`;
      default:
        return `\`${clean}\``;
    }
  }

  getPlaceholder(index, key) {
    switch (this.type) {
      case DIALECTS.POSTGRESQL:
        return `$${index + 1}`;
      case DIALECTS.ORACLE:
        return `:${index + 1}`;
      case DIALECTS.MSSQL:
        return `@${key}`;
      default:
        return '?';
    }
  }

  compileLimit(limit) {
    const result = { prefix: '', suffix: '', ending: '' };

    switch (this.type) {
      case DIALECTS.MSSQL:
        result.prefix = `TOP ${limit.count} `;
        break;
      case DIALECTS.ORACLE:
        result.ending = ` FETCH FIRST ${limit.count} ROWS ONLY`;
        break;
      default:
        result.ending = ` LIMIT ${limit.count}`;
        break;
    }

    limit.offset = parseInt(limit.offset, 10);
    if (limit.offset !== null && !isNaN(limit.offset)) {
      switch (this.type) {
        case DIALECTS.MSSQL:
        case DIALECTS.ORACLE:
          result.prefix = '';

          result.suffix = ` OFFSET ${limit.offset} ROWS`;
          result.ending = ` FETCH FIRST ${limit.count} ROWS ONLY`;
          break;
        default:
          result.suffix = result.ending;
          result.ending = ` OFFSET ${limit.offset}`;
      }
    }

    return result;
  }

  applyReturning(primary) {
    const result = {};
    switch (this.type) {
      case DIALECTS.MSSQL:
        result['prefix'] = ` OUTPUT INSERTED.${primary}`;
        break;
      case DIALECTS.ORACLE:
        result['suffix'] = ` RETURNING ${primary} INTO :${primary}`;
        break;
      case DIALECTS.POSTGRESQL:
        result['suffix'] = ` RETURNING ${primary}`;
        break;
    }

    return result;
  }

  resolveOrder(column, list) {
    let result = ''
    switch(this.type) {
      case DIALECTS.MARIADB:
      case DIALECTS.MYSQL:
        const sql = `FIELD(${column}, ${list.join(',')})`;
        result = `(${sql} = 0) ${sql}`;
        break;
      case DIALECTS.POSTGRESQL:
        result = `array_position(ARRAY[${list.join(',')}], ${column}) NULLS LAST`;
        break;
      default:
        result = `CASE ${column}`;
        for (let i; i < list.length; i++) result += ` WHEN ${list[i]} THEN ${i + 1}`;

        result += `ELSE ${list.length + 1} END`;
    }

    return result
  }

	/**
   * Evaluates if the active engine type structurally supports ORDER BY constraints during write actions.
   * @returns {boolean}
   */
  supportsOrderInWrite() {
    // Apenas MySQL e MariaDB possuem suporte nativo direto a ORDER BY em comandos UPDATE e DELETE
    return this.type === DIALECTS.MYSQL || this.type === DIALECTS.MARIADB;
	}
}