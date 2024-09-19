import fastify from 'fastify'
import dotenv from 'dotenv'
import cors from '@fastify/cors'
import { routes } from './routes'

const app = fastify({ logger: true }) // logger: true para exibir os logs no console
dotenv.config()


app.setErrorHandler((error, request, reply) => {
 reply.code(400).send({ error: error.message })
})

const start = async () => {
    app.register(cors)
    app.register(routes)
  try {
    
    await app.listen({ port: 4000, host: "0.0.0.0"})
    console.log("Servidor rodando no http://localhost:4000")
  } catch (err) {
    console.log(err)
  }
}
start()
