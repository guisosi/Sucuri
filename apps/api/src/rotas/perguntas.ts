// Rotas de cadastro de perguntas
import type { BunRequest } from "bun";
import { banco } from "../banco/conexao";
import { erro, verificarObrigatorios } from "./ajudantes";

const CAMPOS_OBRIGATORIOS = [
  "tema_id",
  "enunciado",
  "alternativa_1",
  "alternativa_2",
  "alternativa_3",
  "correta",
];

// Pergunta junto com o nome do tema
const SELECT_COM_TEMA = `
  SELECT perguntas.*, temas.nome AS tema_nome
  FROM perguntas
  JOIN temas ON temas.id = perguntas.tema_id
`;

// Regras do enunciado: devolve a mensagem do problema, ou null se estiver ok
function validar(dados: any) {
  const problema = verificarObrigatorios(dados, CAMPOS_OBRIGATORIOS);
  if (problema) return problema;

  if (![1, 2, 3].includes(Number(dados.correta))) {
    return "A alternativa correta deve ser 1, 2 ou 3.";
  }

  // Alternativas repetidas teriam mais de uma resposta certa
  const alternativas = [dados.alternativa_1, dados.alternativa_2, dados.alternativa_3];
  const diferentes = new Set(alternativas.map((a) => String(a).trim().toLowerCase()));
  if (diferentes.size < 3) return "As três alternativas devem ser diferentes.";

  return null;
}

// Valores na ordem das colunas, sem espaços sobrando
function valores(dados: any) {
  return [
    Number(dados.tema_id),
    String(dados.enunciado).trim(),
    String(dados.alternativa_1).trim(),
    String(dados.alternativa_2).trim(),
    String(dados.alternativa_3).trim(),
    Number(dados.correta),
  ];
}

// GET /api/perguntas   ou   /api/perguntas?tema_id=1
export function listar(req: BunRequest) {
  const tema_id = new URL(req.url).searchParams.get("tema_id");

  if (tema_id) {
    const doTema = banco.query(`${SELECT_COM_TEMA} WHERE perguntas.tema_id = ?`).all(tema_id);
    return Response.json(doTema);
  }

  const todas = banco.query(SELECT_COM_TEMA).all();
  return Response.json(todas);
}

// GET /api/perguntas/:id
export function buscar(req: BunRequest<"/api/perguntas/:id">) {
  const pergunta = banco.query(`${SELECT_COM_TEMA} WHERE perguntas.id = ?`).get(req.params.id);
  if (!pergunta) return erro("Pergunta não encontrada.", 404);

  return Response.json(pergunta);
}

// POST /api/perguntas
export async function criar(req: BunRequest) {
  const dados = await req.json();

  const problema = validar(dados);
  if (problema) return erro(problema);

  const resultado = banco
    .query(
      `INSERT INTO perguntas (tema_id, enunciado, alternativa_1, alternativa_2, alternativa_3, correta)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .run(...valores(dados));

  const perguntaCriada = banco
    .query(`${SELECT_COM_TEMA} WHERE perguntas.id = ?`)
    .get(resultado.lastInsertRowid);
  return Response.json(perguntaCriada, { status: 201 });
}

// PUT /api/perguntas/:id
export async function atualizar(req: BunRequest<"/api/perguntas/:id">) {
  const dados = await req.json();

  const problema = validar(dados);
  if (problema) return erro(problema);

  const resultado = banco
    .query(
      `UPDATE perguntas
       SET tema_id = ?, enunciado = ?, alternativa_1 = ?, alternativa_2 = ?, alternativa_3 = ?, correta = ?
       WHERE id = ?`,
    )
    .run(...valores(dados), req.params.id);

  // Nenhuma linha alterada: o id não existe
  if (resultado.changes === 0) return erro("Pergunta não encontrada.", 404);

  return buscar(req);
}

// DELETE /api/perguntas/:id
export function excluir(req: BunRequest<"/api/perguntas/:id">) {
  const resultado = banco.query("DELETE FROM perguntas WHERE id = ?").run(req.params.id);
  if (resultado.changes === 0) return erro("Pergunta não encontrada.", 404);

  return Response.json({ mensagem: "Pergunta excluída." });
}