const adapter = function(instance) {
   if (typeof instance.query === 'function') {
      return async(sql, params, method, primary) => {
			const result = await instance.query(sql, params);

			let output;
			switch (method) {
				case 'select':
					output = result.rows;
					break;
				case 'insert':
               output = {
                  id: () => {
                     const [inserted] = result.rows;
                     let id = null;

                     if (inserted && typeof primary === 'string') {
                        id = inserted[primary];
                     }

                     return (id || null);
                  }
               };
            default:
               output = { rowCount: result.rowCount };
			}

			return output;
		}
	}

	return null
}

export default adapter;