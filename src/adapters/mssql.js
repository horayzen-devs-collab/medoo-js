const extractPlaceholders = (sql) => {
	const matches = [...sql.matchAll(/@([a-zA-Z_]+)/g)];
   return matches.map(match => match[1]);
}

const adapter = function(instance) {
   if (typeof instance.request === 'function') {
      return async(sql, params, method, primary) => {
         const request = instance.request();
      	const placeholders = extractPlaceholders(sql);
         
         for (let i = 0; i < params.length; i++) {
            const name = placeholders[i];
            const value = params[i];

            request.input(name, value);
         }

         const result = await request.query(sql);
         let output;

         switch (method) {
            case 'select':
               output = result.recordset;
               break;
            case 'insert':
               output = {
                  id: () => {
                     const [inserted] = result.recordset;
                     let id = null;

                     if (inserted && typeof primary === 'string') {
                        id = inserted[primary];
                     }

                     return (id || null);
                  }
               };
               break;
            default:
               output = { rowCount: result.rowsAffected };
         }

         return output;
      }
   }

   return null
}

export default adapter;