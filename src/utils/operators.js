const OPERATORS = ['=', '!=', '~', '!~', '>', '>=', '<', '<=', '<>', '><', 'IN', '!IN', 'REGEXP', '!REGEXP', 'IS NULL', 'IS NOT NULL'];

export const resolveOperator = (operator, placeholders) => {
	const operation = { prefix: '', suffix: '' };

	if (operator && !OPERATORS.includes(operator)) {
      throw new Error(`MedooJS Execution Error: Illegal value '${operator}' for operator in WHERE clause! Execution aborted.`)
   }

	let symbol = operator;
	if (operator?.length > 1) {
		const cond = operator.startsWith('!');

		if ((cond && !operator.endsWith('=')) || operator === '><') {
			operation.prefix = 'NOT ';
			
			if (cond) {
				symbol = operator.replace('!', '');
			}
		}
	}

	if (symbol) {
		switch (symbol) {
			case '~':
				operation.prefix += 'LIKE ';
				break;
			case '<>':
			case '><':
				operation.prefix += 'BETWEEN ';
				operation.suffix += ' AND ';
				break;
			default:
				operation.prefix += `${symbol} `;
		}
	} else {
		operation.prefix = '= ';
	}

	let resolved = `${operation.prefix}`;
	if (operation.suffix !== '') {
		resolved += `${placeholders[0]} ${operation.suffix}${placeholders[1]}`;
	} else {
		if (symbol === '~') {
			resolved = [];

			placeholders.forEach(placeholder => {
				resolved.push(`${operation.prefix}${placeholder}`);
			});
		} else if (placeholders.length > 1) {
			resolved += `(${placeholders.join()})`;
		} else if (placeholders.length) {
			resolved += `${placeholders[0]}`;
		} else {
			resolved = resolved.trim();
		}
	}
	
	return resolved;
}