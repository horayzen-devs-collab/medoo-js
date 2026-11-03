/**
 * Purpose: Intelligent Adaptable Core Client Orchestrator
 * Description: Evaluates exec types (function vs driver instance) to apply default query runners dynamically.
 */

import { WhereCompiler } from './builder.js';
import { Dialect } from './dialect.js';
import { compileSelect } from '../methods/select.js';
import { compileGet } from '../methods/get.js';
import { compileInsert } from '../methods/insert.js';
import { compileUpdate } from '../methods/update.js';
import { compileDelete } from '../methods/delete.js';

export class Medoo {
  constructor(config = {}) {
    if (!config.type) {
      throw new Error("MedooJS Configuration Error: Property config field 'type' tracking system targets is required.");
    }
    
    this.dialect = new Dialect(config.type);
    this.whereCompiler = new WhereCompiler(this.dialect);

    const executor = config.exec;
    this.executor = null;

    if (executor) {
      if (!Array.isArray(executor)) {
        switch (typeof executor) {
          case 'function':
            // Standard Explicit Functional Callback Delegate Wrapper
            this.executor = executor;
            break;
          case 'object':
            // Native Connected Driver Instanced Pipeline Automation Auto-Wiring
            const handler = this._resolve(config.type, executor);

            this.executor = async(...args) => {
              const adapter = await handler;
              return adapter(...args);
            }
            break;
          default:
            throw new Error("MedooJS Configuration Error: Illegal value for config field 'exec'!");
        }
      } else {
        throw new Error("MedooJS Configuration Error: Illegal value for config field 'exec'!");
      }
    } else {
      // Default Fallback Driverless Compilation Logging Mock Interface
      if (config.testMode) {
        this.mode = 'test';
        this.executor = async(query, params) => ({ query, params, info: `[Testing Mode] Driverless dry-run output compiled for '${config.type.toUpperCase()}'.` });
      } else {
        throw new Error("MedooJS Configuration Error: Property config field 'exec' tracking system targets is required.");
      }
    }
  }

  /**
   * Evaluates driver structures dynamically at instance initialization to bind accurate execution patterns.
   * @param {string} type - Engine type string value descriptor.
   * @param {Object} instance - Active structural network client class link target.
   * @returns {Function} Standardized execution handler pipeline.
   */
   _resolve(type, instance) {
    const target = type.toLowerCase();

    return import(`../adapters/${target}.js`).then(({ default: adapter }) => {
      if (typeof adapter === 'function') {
        const executor = adapter(instance);

        if (typeof executor === 'function') {
          return executor;
        }
      }
      
      // Unrecognized driver signature layout fallback
      throw new Error(`MedooJS Error: The execution instance provided doesn't map standard signatures for dialect type: '${type}'.`);
    });
  }

  type(dialect) {
    if (this.mode === 'test') {
      this.dialect.setup(dialect);
      return true
    }

    throw new Error("MedooJS Error: The call of function 'type() is only supported in 'testMode'.")
  }

  async select(table, ...args) {
    const payload = compileSelect(this.dialect, this.whereCompiler, table, ...args);
    return this.executor(payload.query, payload.params, 'select');
  }

  async get(table, ...args) {
    const payload = compileGet(this.dialect, this.whereCompiler, table, ...args);
    return this.executor(payload.query, payload.params, 'select');
  }

  async _insert(table, data, primary) {
    const payload = compileInsert(this.dialect, table, data, primary);
    return this.executor(payload.query, payload.params, 'insert', primary);
  }

  async insert(table, data, primary) {
    if (Array.isArray(data)) {
      if (data.length > 1) {
        const output = [];

        for (let i; i < data.length; i++) {
          const entry = data[i];
          const result = this._insert(table, entry, primary);

          output.push(result.id());
        }

        return { id: () => output };
      }

      throw new Error("MedooJS Error: Multi-insertion payload structure maps a single or empty entries list.")
    }
    
    return this._insert(table, data, primary);
  }

  async update(table, data, where) {
    const payload = compileUpdate(this.dialect, this.whereCompiler, table, data, where);
    return this.executor(payload.query, payload.params, 'update');
  }

  async delete(table, where) {
    const payload = compileDelete(this.dialect, this.whereCompiler, table, where);
    return this.executor(payload.query, payload.params, 'delete');
  }
}