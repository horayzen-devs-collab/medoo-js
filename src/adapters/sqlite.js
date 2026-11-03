const adapter = function(instance) {
   if (typeof instance.prepare === 'function') {
      return new Promise((resolve, reject) => {
		 	return (sql, params, method) => {
		   	try {
		     		const stmt = instance.prepare(sql);
		     		const action = method === 'select' ? 'all' : 'run';
		     		const result = stmt[action](params);

		     		let output;
		     		switch (method) {
		            case 'select':
		               output = result;
		               break;
		            case 'insert':
		               output = { id: () => result.lastInsertRowid };
		               break;
		            default:
		               output = { rowCount: result.changes };
		         }

		       	resolve(output);
		   	} catch (err) {
		     		reject(err);
		   	}
		 	}
		});
   }

   return null
}

export default adapter;