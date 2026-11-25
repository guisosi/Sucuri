// Dados de exemplo; pode rodar várias vezes sem duplicar
import { banco } from "./conexao";

const temas = ["React", "SQLite", "JavaScript", "HTML e CSS"];

// "?" é o parâmetro: o valor nunca é colado direto no SQL
const inserir = banco.query("INSERT OR IGNORE INTO temas (nome) VALUES (?);");

for (const nome of temas) inserir.run(nome);

console.log(`Banco populado com ${temas.length} temas`);
