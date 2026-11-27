// Ponto de entrada da API: mapa de rotas

// Importar a conexão já cria o banco e as tabelas
import "./banco/conexao";
import { erro, traduzirErroDoBanco } from "./rotas/ajudantes";
import * as temas from "./rotas/temas";
import * as perguntas from "./rotas/perguntas";

const porta = Number(Bun.env.PORT ?? 3333);

const servidor = Bun.serve({
  port: porta,

  // Cada caminho aponta para a função de cada método HTTP
  routes: {
    "/api/saude": { GET: () => Response.json({ ok: true }) },

    "/api/temas": { GET: temas.listar, POST: temas.criar },

    "/api/perguntas": { GET: perguntas.listar, POST: perguntas.criar },
    "/api/perguntas/:id": {
      GET: perguntas.buscar,
      PUT: perguntas.atualizar,
      DELETE: perguntas.excluir,
    },
  },
  
  // Nenhuma rota bateu
  fetch() {
    return erro("Rota não encontrada.", 404);
  },

  // Qualquer erro que escapar das rotas cai aqui
  error(problema) {
    if (problema instanceof SyntaxError) return erro("Envie os dados em JSON válido.");

    const traduzida = traduzirErroDoBanco(problema.message);
    if (traduzida) return erro(traduzida);

    console.error(problema);
    return erro("Erro interno no servidor.", 500);
  },
});

console.log(`API rodando em http://localhost:${servidor.port}`);
