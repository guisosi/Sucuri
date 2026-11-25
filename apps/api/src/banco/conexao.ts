// Abre o banco, cria o arquivo se não existir e garante as tabelas
import { Database } from "bun:sqlite";
import { join } from "node:path";
import { criarTabelas } from "./criar-tabelas";

// Padrão: apps/api/quiz.sqlite - no servidor, aponte BANCO_CAMINHO para um disco persistente
const caminho = Bun.env.BANCO_CAMINHO ?? join(import.meta.dir, "..", "..", "quiz.sqlite");

export const banco = new Database(caminho, { create: true });

// No SQLite a chave estrangeira vem desligada
banco.run("PRAGMA foreign_keys = ON;");

criarTabelas(banco);
