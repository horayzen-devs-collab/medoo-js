const adapter = function(instance) {
   if (typeof instance.execute === 'function') {
      return async(sql, params, method) => {
         const result = await instance.execute(sql, params);

         let output;
         switch (method) {
            case 'select':
               [output] = result;
               break;
            case 'insert':
               output = { id: () => result.insertId };
               break;
            case 'update':
               output = { rowCount: result.changedRows };
            default:
               output = { rowCount: result.affectedRows };
         }

         return output;
      }
   }

   return null
}

export default adapter;