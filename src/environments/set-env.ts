import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

// Configura dotenv para ler o .env
config();

// Obter __dirname em módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const devContent = `export const environment = {
  production: false,
  locationIqApiKey: "${process.env['LOCATION_IQ_API_KEY'] || ''}",
  SERVIDOR: "${process.env['API_URL_DEV'] || 'http://localhost:8080'}"
};
`;

const prodContent = `export const environment = {
  production: true,
  locationIqApiKey: "${process.env['LOCATION_IQ_API_KEY'] || ''}",
  SERVIDOR: "${process.env['API_URL_PROD'] || 'http://fallback-ip:8080'}" // Variável PROD (IP Público)
};
`;

const devPath = join(__dirname, 'environment.ts');
const prodPath = join(__dirname, 'environment.prod.ts');

writeFileSync(devPath, devContent, 'utf8');
writeFileSync(prodPath, prodContent, 'utf8'); // <-- GERA O ARQUIVO DE PRODUÇÃO
console.log('✅ Environment files generated successfully!');