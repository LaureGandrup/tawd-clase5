require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginLandingPageLocalDefault } = require('@apollo/server/plugin/landingPage/default');
const mongoose = require('mongoose');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const startServer = async () => {
  const app = express();
  
  // Conectar a MongoDB
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB Atlas');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1);
  }

  // Apollo Server con introspección y Apollo Sandbox habilitados explícitamente
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    plugins: [
      ApolloServerPluginLandingPageLocalDefault({ footer: false })
    ],
  });

  await server.start();

  // Configuración de GraphQL en el endpoint /graphql
  app.use(
    '/graphql',
    cors(),
    express.json(),
    // Middleware extra de seguridad por si express.json() no inicializa req.body en peticiones GET sin Content-Type
    (req, res, next) => {
      if (!req.body) req.body = {};
      next();
    },
    expressMiddleware(server)
  );

  // Iniciar Express
  // Render provee el puerto automáticamente a través de process.env.PORT
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor GraphQL listo en http://localhost:${PORT}/graphql`);
  });
};

startServer();
