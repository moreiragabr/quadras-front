import { writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { config } from 'dotenv';

// Obter __dirname em módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Tenta localizar o .env na raiz do projeto (subindo de src/environments para a raiz)
const envPath = resolve(__dirname, '../../.env');

console.log('🔍 Procurando arquivo .env em:', envPath);
console.log('file exists:', existsSync(envPath));

// Configura dotenv para ler o .env do caminho absoluto
const result = config({ path: envPath });

if (result.error) {
  console.error('❌ Erro ao carregar .env:', result.error);
} else {
  console.log('✅ Arquivo .env carregado com sucesso!');
}

console.log('API_URL_PROD detectada:', process.env['API_URL_PROD']);

const devContent = `export const environment = {
  production: false,
  locationIqApiKey: "${process.env['LOCATION_IQ_API_KEY'] || ''}",
  SERVIDOR: "${process.env['API_URL_DEV'] || 'http://localhost:8080'}"
};
`;

const prodContent = `export const environment = {
  production: true,
  locationIqApiKey: "${process.env['LOCATION_IQ_API_KEY'] || ''}",
  SERVIDOR: "${process.env['API_URL_PROD'] || 'https://quadras-api.lab.local'}"
};
`;

const devPath = join(__dirname, 'environment.ts');
const prodPath = join(__dirname, 'environment.prod.ts');

writeFileSync(devPath, devContent, 'utf8');
writeFileSync(prodPath, prodContent, 'utf8'); // <-- GERA O ARQUIVO DE PRODUÇÃO
console.log('✅ Environment files generated successfully!');