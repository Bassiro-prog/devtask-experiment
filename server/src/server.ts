import { createApp } from './app.js';

const port = Number(process.env.PORT) || 3333;
// Sem autenticação: por padrão a API só aceita conexões da própria máquina.
const host = process.env.HOST || 'localhost';

createApp().listen(port, host, () => {
  console.log(`DevTask API rodando em http://${host}:${port}`);
});
