import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

// Configura dotenv
config();

// Obter __dirname em módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const environmentContent = `export const environment = {
  production: ${process.env['PRODUCTION'] || false},
  locationIqApiKey: "${process.env['LOCATION_IQ_API_KEY'] || ''}",
};
`;

// Caminho para o environment.ts
const targetPath = join(__dirname, 'environment.ts');

// Escreve o arquivo
writeFileSync(targetPath, environmentContent, 'utf8');
console.log('✅ Environment file generated successfully!');