# Documentação do projeto

---

## 1. O que é o projeto

Um **quiz de revisão de programação web**. Dá para cadastrar perguntas por tema (React, SQLite...) e responder a um quiz. No final aparece o total de acertos.

**Regras do enunciado:**

- Toda pergunta tem **três alternativas preenchidas** e **uma única correta**.
- Quem confere as respostas e conta os acertos é a **API**, não a tela.
- A tela do quiz só recebe a resposta certa **depois** que o aluno envia as respostas.

---

## 2. Como as partes conversam

```
Telas (React)  →  API (Bun)  →  Banco (SQLite)
  apps/web         apps/api       quiz.sqlite
```

- **Telas (front-end):** o que o usuário vê e clica.
- **API (back-end):** recebe os pedidos das telas, aplica as regras e fala com o banco.
- **Banco:** guarda os temas e as perguntas.

Front e back são **separados**: cada um tem a sua pasta e o seu servidor. Eles conversam por HTTP, trocando dados em JSON.

---

## 3. Tecnologias

| Tecnologia | Para que serve |
|---|---|
| **TypeScript** | A linguagem do projeto inteiro (JavaScript com tipos). |
| **Bun** | Roda a API, instala pacotes e executa os scripts. Já traz o SQLite embutido. |
| **SQLite** | Banco de dados num arquivo só (`apps/api/quiz.sqlite`). |
| **SQL puro** | Os comandos do banco são escritos à mão, sem ORM. |
| **React + Vite** | As telas. |
| **Git + GitHub** | Histórico do código. Cada etapa numa branch, entrando na `main` por Pull Request. |

---

## 4. Pastas

```
apps/
  api/                    ← back-end
    src/
      index.ts            ← mapa de rotas: liga cada endereço a uma função
      banco/
        conexao.ts        ← abre o banco e cria as tabelas
        criar-tabelas.ts  ← o SQL das tabelas e das regras
        popular.ts        ← coloca temas de exemplo
      rotas/
        ajudantes.ts      ← funções usadas por todas as rotas
        temas.ts          ← rotas de temas
        perguntas.ts      ← rotas de cadastro de perguntas
  web/                    ← front-end
packages/
  tipos/                  ← formato dos dados, usado pela API e pelas telas
docs/
  DOCUMENTACAO.md         ← este arquivo
```

---

## 5. Banco de dados

### Tabela `temas`

| Coluna | Regra |
|---|---|
| `id` | Número criado sozinho. |
| `nome` | Obrigatório, não pode ser só espaços e não pode repetir. "React" e "react" contam como o mesmo (`COLLATE NOCASE`). |

### Tabela `perguntas`

| Coluna | Regra |
|---|---|
| `id` | Número criado sozinho. |
| `tema_id` | Precisa ser um tema que existe (`REFERENCES temas`). |
| `enunciado` | Obrigatório, não pode ser só espaços. |
| `alternativa_1`, `_2`, `_3` | Obrigatórias, não podem ser só espaços. |
| `correta` | Só aceita 1, 2 ou 3 (`CHECK`). |

**O banco é criado sozinho** quando a API sobe. Para zerar, é só apagar o `quiz.sqlite` e subir a API de novo.

---

## 6. Rotas da API

Endereço base: `http://localhost:3333/api`

| Método | Rota | O que faz |
|---|---|---|
| GET | `/saude` | Confere se a API está no ar. |
| GET | `/temas` | Lista os temas. |
| POST | `/temas` | Cadastra um tema. |
| GET | `/perguntas` | Lista as perguntas. Com `?tema_id=1`, filtra por tema. |
| GET | `/perguntas/:id` | Busca uma pergunta (usada na tela de edição). |
| POST | `/perguntas` | Cadastra uma pergunta. |
| PUT | `/perguntas/:id` | Edita uma pergunta. |
| DELETE | `/perguntas/:id` | Exclui uma pergunta. |

As rotas de `/perguntas` são do **cadastro** e mostram a alternativa correta. O quiz terá rotas próprias, **sem** a resposta (etapa 4).

**Erros** sempre voltam assim: `{ "erro": "mensagem" }`

| Status | Quando |
|---|---|
| 200 | Deu certo. |
| 201 | Cadastrou. |
| 400 | Dado inválido (campo vazio, correta fora de 1 a 3, tema repetido...). |
| 404 | Não encontrado. |
| 500 | Erro inesperado no servidor. |

---

## 7. Validação em duas camadas

Uma pergunta só é salva se passar pelas **duas**:

1. **Na API** (`validar()` em `perguntas.ts`): devolve uma mensagem clara, como "O campo alternativa_2 é obrigatório.".
2. **No banco** (`CHECK` em `criar-tabelas.ts`): a última barreira, caso algo passe por fora da API.

Regras da `validar()`:

- todos os campos preenchidos;
- `correta` é 1, 2 ou 3;
- as três alternativas são diferentes (senão haveria mais de uma resposta certa).

**Por que validar na API se a tela já pode ter botões?** Porque dá para mandar dados direto para a API, sem a tela (por `curl`, Postman ou F12 no navegador). A tela ajuda o usuário; quem garante a regra é a API.

---

## 8. Onde mexer se o professor pedir

| Pedido | Onde |
|---|---|
| Mudar uma mensagem de erro | `validar()` em `perguntas.ts` ou `ajudantes.ts` |
| Criar uma regra nova para a pergunta | um `if` a mais em `validar()` |
| Tornar um campo obrigatório | a lista `CAMPOS_OBRIGATORIOS` em `perguntas.ts` |
| Criar uma rota nova | uma função no arquivo da rota + uma linha em `index.ts` |
| Mudar uma regra do banco | `criar-tabelas.ts` (e apagar o `quiz.sqlite` para recriar) |
| Mudar os temas de exemplo | a lista em `popular.ts` |
| Mudar a porta | variável `PORT` (padrão 3333) |

---

## 9. Segurança

- **SQL sempre com `?`:** o valor do usuário nunca é colado no meio do SQL. Isso evita *SQL injection*.
- **Nada de segredo no código:** configurações ficam em variáveis de ambiente (`.env`), que não vão para o GitHub.
- **Erros não expõem detalhes internos:** o usuário recebe uma mensagem simples, e o detalhe fica só no terminal.

---

## 10. Como rodar

**Precisa ter:** Bun e Git.

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

A API fica em `http://localhost:3333/api/saude`.
