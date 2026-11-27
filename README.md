# Sucuri: quiz de revisão de programação web

Aplicação para cadastrar perguntas de múltipla escolha por tema e responder a um quiz, com o total de acertos conferido pela API.

**Stack:** TypeScript · Bun · SQLite (SQL puro) · React + Vite

## Como rodar

Precisa ter o [Bun](https://bun.sh) e o Git instalados.

```bash
git clone https://github.com/guisosi/Sucuri.git
cd Sucuri
bun install
bun run dev:api
```

Em outro terminal, coloque os temas de exemplo:

```bash
bun run banco:popular
```

Teste em `http://localhost:3333/api/saude`.

## Documentação

O guia completo (pastas, banco, rotas e regras) está em [docs/DOCUMENTACAO.md](docs/DOCUMENTACAO.md).
