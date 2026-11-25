// Rotas de temas
import type { BunRequest } from "bun";
import { banco } from "../banco/conexao";
import { erro, verificarObrigatorios } from "./ajudantes";

//GET /api/temas
export function listar() {
    const temas = banco.query("SELECT * FROM temas ORDER BY nome").all();
    return Response.json(temas);
}

//POST /api/temas
export async function criar(req: BunRequest) {
    const dados = await req.json();

    const problema = verificarObrigatorios(dados, ["nome"]);
    if (problema) return erro(problema);

    const resultado = banco.query("INSERT INTO temas (nome) VALUES (?)").run(dados.nome.trim());

    const temaCriado = banco.query("SELECT * FROM temas WHERE id = ?").get(resultado.lastInsertRowid);
    return Response.json(temaCriado, { status: 201 });
}