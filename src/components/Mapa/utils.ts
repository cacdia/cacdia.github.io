import { Sala } from "./types";

/**
 * Normaliza um código de sala removendo caracteres extras e padronizando formato
 * @param codigo Código da sala para normalizar
 * @returns Código normalizado
 */
function normalizarCodigo(codigo: string): string {
    return codigo
        .trim()                           // Remove espaços no início/fim
        .toUpperCase()                    // Converte para maiúsculo
        .replace(/\s+/g, ' ')            // Substitui múltiplos espaços por um só
        .replace(/[-_]/g, ' ')           // Substitui hífens e underscores por espaço
        .replace(/\s*\(\s*/g, ' (')      // Padroniza espaços antes de parênteses
        .replace(/\s*\)\s*/g, ') ')      // Padroniza espaços depois de parênteses
        .trim();
}

/**
 * Gera variações possíveis de um código de sala para tentar fazer match
 * @param codigo Código original da sala
 * @returns Array com variações possíveis
 */
function gerarVariacoesCodigo(codigo: string): string[] {
    const normalizado = normalizarCodigo(codigo);
    const variacoes = new Set<string>();

    // Adiciona o código normalizado
    variacoes.add(normalizado);

    // Se não tem prefixo de bloco, tenta adicionar "CI"
    if (!normalizado.includes(' ') || normalizado.match(/^\d/)) {
        variacoes.add(`CI ${normalizado}`);
    }

    // Se tem prefixo, tenta sem ele
    const partes = normalizado.split(' ');
    if (partes.length > 1) {
        const salaCode = partes.slice(1).join(' ');
        variacoes.add(salaCode);

        // Também tenta com outros blocos comuns
        variacoes.add(`LIEPE ${salaCode}`);
    }

    // Tenta versão com hífen
    if (normalizado.includes(' ')) {
        variacoes.add(normalizado.replace(' ', '-'));
    }

    // Tenta versão sem espaços (para casos como "T07" vs "T 07")
    if (normalizado.includes(' ')) {
        variacoes.add(normalizado.replace(/\s/g, ''));
    }

    return Array.from(variacoes);
}

/**
 * Encontra uma sala pelo seu código com tolerância a variações de formato
 * @param codigo Código da sala (ex: "CI T01", "CI 101", "T01", "ci-107")
 * @param salas Lista de salas disponíveis
 * @returns A sala encontrada ou undefined se não encontrar
 */
export function getSala(codigo: string, salas: Sala[]): Sala | undefined {
    if (!codigo || !salas?.length) return undefined;

    // Primeiro tenta encontrar com o código exato
    let sala = salas.find((s) => s.codigo === codigo);
    if (sala) return sala;

    // Gera variações do código de busca
    const variacoesBusca = gerarVariacoesCodigo(codigo);

    // Tenta cada variação do código de busca contra os códigos das salas
    for (const variacao of variacoesBusca) {
        sala = salas.find((s) => {
            // Compara com o código original da sala
            if (s.codigo === variacao) return true;

            // Compara com variações do código da sala
            const variacoesSala = gerarVariacoesCodigo(s.codigo);
            return variacoesSala.includes(variacao);
        });

        if (sala) return sala;
    }

    // Se ainda não encontrou, tenta match mais flexível apenas com o nome da sala
    const nomeSimplificado = normalizarCodigo(codigo).replace(/^(CI|LIEPE)\s+/, '');

    return salas.find((s) => {
        const nomeSala = normalizarCodigo(s.nome);
        const codigoSala = normalizarCodigo(s.codigo).replace(/^(CI|LIEPE)\s+/, '');

        return nomeSala === nomeSimplificado || codigoSala === nomeSimplificado;
    });
}
