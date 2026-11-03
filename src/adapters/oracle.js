const adapter = function(instance) {
   if (typeof instance.execute === 'function') {
      return async(sql, params, method, primary) => {
      	const data = { ...params };
      	if (typeof primary === 'string') {
      		data[primary] = {
   				dir: 3003
   			}
      	}

		  	const result = await instance.execute(sql, data, { outFormat: 4002 });
		  	let output;

		  	switch (method) {
		  		case 'select':
		   		output = result.rows;
		   		break;
		   	case 'insert':
		   		output = {
                  id: () => {
                     const binds = result.outBinds;
                     let id = null;

                     if (binds && typeof primary === 'string') {
                        id = binds[primary];
                     }

                     return (id || null);
                  }
               };
            default:
               output = { rowCount: result.rowsAffected };
		  	}

		  	return output;
		}
	}

	return null
}

export default adapter;