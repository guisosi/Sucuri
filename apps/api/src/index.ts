// Ponto de entrada da API

// Importar a conexão já cria o banco e as tabelas
import "./banco/conexao";

const porta = Number(Bun.env.PORT ?? 3333);

const servidor = Bun.serve({
  port: porta,

  // Roda a cada requisição recebida
  fetch(requisicao) {
    const url = new URL(requisicao.url);

    // Rota de teste para ver se a API está no ar
    if (requisicao.method === "GET" && url.pathname === "/api/saude") {
      return Response.json({ ok: true });
    }

    // Nenhuma rota bateu
    return Response.json({ erro: "Rota não encontrada." }, { status: 404 });
  },
});

console.log(`API rodando em http://localhost:${servidor.port}`);
