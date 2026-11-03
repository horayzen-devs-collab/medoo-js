/**
 * Purpose: Security Validation & Formatting Utilities
 * Description: Implements strict structural checking for identifiers to block SQL injection and formats projection tokens.
 */

/**
 * Validates names used for tables or columns.
 * Se encontrar qualquer caractere de quebra de comando, aspas ou operadores de comentário,
 * lança um erro imediatamente e interrompe a execução do programa.
 * @param {string} name - Raw identifier target input string.
 * @returns {string} The validated identifier name if safe.
 * @throws {Error} If the identifier contains illegal or dangerous characters.
 */
export const sanitizeIdentifier = (name) => {
  if (typeof name !== 'string') return '';
  
  const trimmed = name.trim();
  
  // Expressão regular para segurança contra escapes e quebras
  const regex = /[\0\n\r\b\t;`'"\\\]\[#\/\*]|\-\-/;
  
  if (regex.test(trimmed)) {
    throw new Error(`MedooJS Security Error: Illegal characters detected in identifier name '${trimmed}'. Execution aborted.`);
  }

  return trimmed;
}
 
/**
 * Helper interno para quebrar e escapar identificadores compostos por ponto (ex: posts.title)
 */
const escapeCompoundIdentifier = (column, dialect) => {
  const cleanColumn = sanitizeIdentifier(column);
  
  // Suporte a Aliases do Medoo original: "tabela.coluna(alias)" -> "tabela"."coluna" AS "alias"
  const matched = cleanColumn.match(/^(.+)\((.+)\)$/);
  if (matched) {
    const rawPath = matched[1];
    const aliasName = sanitizeIdentifier(matched[2]);
    const escapedPath = rawPath.split('.').map(part => dialect.escapeIdentifier(sanitizeIdentifier(part))).join('.');
    return `${escapedPath} AS ${dialect.escapeIdentifier(aliasName)}`;
  }

  // Comportamento padrão relacional: "posts.title" -> `posts`.`title`
  return cleanColumn
    .split('.')
    .map(part => dialect.escapeIdentifier(sanitizeIdentifier(part)))
    .join('.');
}

/**
 * Normalizes lists of columns into clean escaped syntax blocks after strict validation.
 * @param {string|string[]} columns - Selected targets or wildcard asset.
 * @param {Object} dialect - Internal active dialect schema map helper.
 * @returns {string} Sanitized select projection fragment string.
 */
export const formatColumns = (columns, dialect) => {
  if (!columns || columns === '*') return '*';
  
  if (typeof columns === 'string') {
    return escapeCompoundIdentifier(columns, dialect);
  }
  
  if (Array.isArray(columns)) {
    return columns
      .map(col => col.trim())
      .filter(col => col.length > 0)
      .map(col => escapeCompoundIdentifier(col, dialect))
      .join(', ');
  }
  
  throw new Error(`MedooJS Execution Error: Illegal 'columns' parameter format: '${columns}'. Execution aborted.`);
}

export class QueryState {
  constructor(dialect) {
    this.dialect = dialect;
    this.index = 0;
    this.params = [];
  }

  addParam(value, key = null) {
    const placeholder = this.dialect.getPlaceholder(this.index, key);

    this.params.push(value);
    this.index++;

    return placeholder;
  }
}