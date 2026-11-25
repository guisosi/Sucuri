// Funcoes usadas por todas rotas

//resposta de erro padrao da api
export function erro(mensagem: string, status = 400) {
    return Response.json({erro: mensagem}, {status});
}

// devolve a mensagem do primeiro campo vazio ou null se tiver preenchido
export function verificarObrigatorios(dados: any, campos: string[]) {
    for (const campo of campos) {
        const valor = dados?.[campo];
        if (valor === undefined || valor === null || String(valor).trim() === "") {
            return `O campo ${campo} é obrigatório`;
        }
    }
    return null;
}

// Traduz os erros do SQlite para portugues, null se nn for erro conhecido
export function traduzirErroDoBanco(mensagem: string) {
    if (mensagem.includes("UNIQUE constraint failed")) return "Já existe um cadastro com esse valor.";
    if (mensagem.includes("FOREIGN KEY constraint failed")) return "Registro relacionado não encontrado.";
    if (mensagem.includes("CHECK constraint failed")) return "Dados inválidos.";
    if (mensagem.includes("NOT NULL constraint failed")) return "Preencha todos os campos com valores válidos.";
    return null;
}
