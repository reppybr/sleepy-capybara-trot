export function generateBatchId(producerName: string, currentSuffix?: string): { prefix: string; year: string; suffix: string } {
  // Lógica para Prefix_AAA: primeiras 3 letras de palavras significativas do nome do produtor
  const insignificantWords = new Set(['da', 'de', 'do', 'das', 'dos', 'e', 'a', 'o', 'em', 'no', 'na', 'com', 'para', 'por', 'um', 'uma', 'um', 'uma', 'os', 'as']);
  const words = producerName
    .split(/\s+/)
    .filter(word => word.length > 1 && !insignificantWords.has(word.toLowerCase()))
    .map(word => word[0].toUpperCase());

  let prefix = words.slice(0, 3).join('');
  while (prefix.length < 3) {
    prefix += 'X'; // Preenche com 'X' se o nome for muito curto
  }
  prefix = prefix.substring(0, 3); // Garante que tenha exatamente 3 caracteres

  // Lógica para Middle_YY: últimos dois dígitos do ano atual
  const year = new Date().getFullYear().toString().slice(-2);

  // Lógica para Suffix_XXXX: 4 caracteres alfanuméricos aleatórios, excluindo ambíguos
  const generateRandomSuffix = () => {
    const chars = 'ABCDEFGHJKMNPQRSTVWXYZ23456789'; // Exclui I, L, 1, O, 0
    let suffix = '';
    for (let i = 0; i < 4; i++) {
      suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return suffix;
  };

  const suffix = currentSuffix || generateRandomSuffix();

  return { prefix, year, suffix };
}