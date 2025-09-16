import express from 'express'
import controller from './controller.js'

const routes = express.Router()

routes.post('/actor', controller.handleInsertActorRequest)

routes.get('/actores', controller.handleGetActoresRequest)

routes.get('/actor/:id', controller.handleGetActorByIdRequest)

routes.get('/actor/:id_pelicula', controller.handleGetActoresByPeliculaIdRequest)

export default routes