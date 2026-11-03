const adapter = function(instance) {
   if (typeof instance.query === 'function') {
      return async(sql, params, method) => {
         const result = await instance.query(sql, params);

         let output;
         switch (method) {
            case 'select':
               output = result;
               break;
            case 'insert':
               output = { id: () => result.insertId };
               break;
            default:
               output = { rowCount: result.affectedRows };
         }

         return output;
      }
   }

   return null
}

export default adapter;