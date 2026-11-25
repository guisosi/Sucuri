// Cria as tabelas se ainda não existirem
import type { Database } from "bun:sqlite";

export function criarTabelas(banco: Database) {
  banco.run(`
    CREATE TABLE IF NOT EXISTS temas (
      id   INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL UNIQUE CHECK (trim(nome) <> '')
    );
  `);

  // CHECK: nada vazio e só uma alternativa correta
  banco.run(`
    CREATE TABLE IF NOT EXISTS perguntas (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      tema_id       INTEGER NOT NULL REFERENCES temas(id),
      enunciado     TEXT NOT NULL CHECK (trim(enunciado) <> ''),
      alternativa_1 TEXT NOT NULL CHECK (trim(alternativa_1) <> ''),
      alternativa_2 TEXT NOT NULL CHECK (trim(alternativa_2) <> ''),
      alternativa_3 TEXT NOT NULL CHECK (trim(alternativa_3) <> ''),
      correta       INTEGER NOT NULL CHECK (correta BETWEEN 1 AND 3)
    );
  `);

  // Acelera o filtro de perguntas por tema
  banco.run(`
    CREATE INDEX IF NOT EXISTS idx_perguntas_tema_id ON perguntas(tema_id);
  `);
}
