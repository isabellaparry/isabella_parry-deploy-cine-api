import { ObjectId } from "mongodb"
import client from "../common/dbconn.js"
import { Pelicula } from "./pelicula.js"

const peliculaCollection = client.db('cine').collection('peliculas')

async function handleInsertPeliculaRequest(req, res){
    let data = req.body
    let pelicula = Pelicula

    pelicula.nombre = data.nombre
    pelicula.generos = data.generos
    pelicula.anioEstreno = data.anioEstreno

    await peliculaCollection.insertOne(pelicula)
    .then( (data) => { 
        if(data === null) return res.status(400).send('Error al guardar registro')

        return res.status(201).send(data)
     } )
    .catch( (e) => { return res.status(500).send( { error: e} )} )
}

async function handleGetPeliculasRequest(req, res) {
    console.log('GET /peliculas handler');
    await peliculaCollection.find({}).toArray()
    .then( (data) => { return res.status(200).send(data) } )
    .catch( (e) => { return res.status(500).send( { error: e } )} )
}

async function handleGetPeliculaByIdRequest(req, res) {
    let id = req.params.id

    try {
        let oid = ObjectId.createFromHexString(id)

        await peliculaCollection.findOne( { _id: oid } )
        .then( (data) => {
            if(data === null) return res.status(404).send(data)

            return res.status(200).send(data)
        } )

    } catch(e){
        return res.status(400).send( { error: e.code } )
    }
}

async function handleUpdatePeliculaByIdRequest(req, res) {
    let id = req.params.id
    let pelicula = req.body

    try{
        let oid = ObjectId.createFromHexString(id)

        let query = { $set: pelicula }

        await peliculaCollection.updateOne( { _id: oid }, query )
        .then( (data) => {
            return res.status(200).send(data)
        }  )
        .catch( (e) => { return res.status(400).send({ code: e.code }) } )
    } catch(e) {
        return res.status(400).send('Id mal generado')
    }
}

async function handleDeletePeliculaByIdRequest(req, res) {
    let id = req.params.id
    
    try{
        let oid = ObjectId.createFromHexString(id)

        await peliculaCollection.deleteOne({ _id: oid })
        .then( (data) => { return res.status(200).send(data) } )
        .catch( (e) => { res.status(500).send({ code: e.code }) } )
    }catch(e){
        return res.status(400).send('Id mal generado')
    }
}

export default {
    handleInsertPeliculaRequest,
    handleGetPeliculasRequest,
    handleGetPeliculaByIdRequest,
    handleUpdatePeliculaByIdRequest,
    handleDeletePeliculaByIdRequest
}