/**
 * Purpose: Security Hardening & Feature Sanity Test Framework
 * Description: Verifies that malicious identifier vectors strictly abort execution, values map to parameters, 
 *              and newly added features (LIKE, ORDER, JOIN) compile flawlessly across different dialects.
 */

import assert from 'assert';
import { Medoo } from '../src/main.js';

async function runSecurityTests() {
  console.log('Beginning Security Isolation and Feature Checks...\n');

  const db = new Medoo({ type: 'mysql', testMode: true });
  const maliciousTableName = 'users; DROP TABLE accounts; --';

  // Teste 1: Validação de Interrupção por Identificador Malicioso
  console.log('\x1b[33m[Test 1] Testing identifier injection interception...\x1b[0m');
  try {
    await db.select(maliciousTableName, ['id', 'username'], { status: 'active' });
    assert.fail('Security Vulnerability: Malicious identifier was not blocked!');
  } catch (err) {
    assert.match(err.message, /MedooJS Security Error/);
    console.log('\x1b[32m✓ Security Check 1: Execution successfully aborted for dangerous identifier.\x1b[0m');
  }

  // Teste 2: Validação de Parametrização de Valores (Prepared Statements)
  console.log('\n\x1b[33m[Test 2] Testing dynamic criteria value parametrization...\x1b[0m');
  const maliciousWhereValue = "' OR '1'='1";
  try {
    const res = await db.select('posts', '*', { author: maliciousWhereValue });
    assert.strictEqual(res.query, 'SELECT * FROM `posts` WHERE `author` = ?;');
    assert.strictEqual(res.params[0], maliciousWhereValue);
    console.log('\x1b[32m✓ Security Check 2: Value injection safely isolated into parameters array.\x1b[0m');
  } catch (err) {
    assert.fail(`Security Failure: Valid query parameters raised an unexpected error: ${err.message}`);
  }

  // Teste 3: Validação do Modificador [~] e Segurança de Pontos (Tabelas Relacionais)
  console.log('\n\x1b[33m[Test 3] Testing LIKE clause compile and relational dot parsing...\x1b[0m');
  try {
    const res = await db.select('posts', ['posts.title', 'users.username'], {
      'posts.status': 'published',
      'users.name[~]': '%admin%'
    });
    
    // Deve quebrar corretamente os identificadores por pontos e parametrizar o valor do LIKE
    assert.strictEqual(res.query, 'SELECT `posts`.`title`, `users`.`username` FROM `posts` WHERE `posts`.`status` = ? AND `users`.`name` LIKE ?;');
    assert.strictEqual(res.params[0], 'published');
    assert.strictEqual(res.params[1], '%admin%');
    console.log('\x1b[32m✓ Feature Check 3: [~] and table dot delimiters compiled cleanly and securely.\x1b[0m');
  } catch (err) {
    assert.fail(`Failure in Test 3: ${err.message}`);
  }

  // Teste 4: Validação do JOIN Estilo Medoo (Deslocamento de Argumentos e Operadores)
  console.log('\n\x1b[33m[Test 4] Testing Medoo-style JOIN parameter shifting and token maps...\x1b[0m');
  try {
    const res = await db.select('posts', {
      '[>]users': { 'author_id': 'id' }
		}, ['posts.id', 'users.username(author_name)'], { 'posts.status': 'active' });

    // Verifica o LEFT JOIN ([>]), a resolução do ON com pontos, e o alias da coluna formatada
    assert.strictEqual(res.query, 'SELECT `posts`.`id`, `users`.`username` AS `author_name` FROM `posts` LEFT JOIN `users` ON `posts`.`author_id` = `users`.`id` WHERE `posts`.`status` = ?;');
    assert.strictEqual(res.params[0], 'active');
    console.log('\x1b[32m✓ Feature Check 4: Complex JOIN shifting, operator mapping, and aliases validated.\x1b[0m');
  } catch (err) {
    assert.fail(`Failure in Test 4: ${err.message}`);
  }

  // Teste 5: Validação das Barreiras e Trava de Segurança de Dialeto (ORDER em Escrita)
  console.log('\n\x1b[33m[Test 5] Testing dialect capability constraints for ORDER clause in write contexts...\x1b[0m');
  
  // 5A: MySQL deve aceitar ORDER no UPDATE
  try {
    const res = await db.update('posts', { status: 'archived' }, { 'status': 'draft', 'ORDER': 'id' });
    assert.match(res.query, /ORDER BY `id` ASC/);
    console.log('\x1b[32m✓ Dialect Check 5A: MySQL allowed ORDER clause inside UPDATE query.\x1b[0m');
  } catch (err) {
    assert.fail(`Failure in Test 5A: MySQL should support ORDER in write context. ${err.message}`);
  }

  // 5B: PostgreSQL deve abortar e lançar erro de suporte caso tentem usar ORDER no UPDATE
  const postgresDb = new Medoo({ type: 'postgresql', testMode: true });
  try {
    await postgresDb.update('posts', { status: 'archived' }, { 'status': 'draft', 'ORDER': 'id' });
    assert.fail('Security/Support Vulnerability: PostgreSQL allowed unsupported ORDER clause in UPDATE context!');
  } catch (err) {
    assert.match(err.message, /MedooJS Support Error/);
    console.log('\x1b[32m✓ Dialect Check 5B: PostgreSQL successfully aborted execution for unsupported write ORDER constraint.\x1b[0m');
  }

  console.log('\nAll core security and feature unit test checks completed successfully.');
}

try {
  await runSecurityTests();
} catch (err) {
  console.error('\nSecurity verification check trace failure:', err.message);
  process.exit(1);
}