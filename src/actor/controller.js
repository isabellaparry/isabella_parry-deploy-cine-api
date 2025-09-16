import { ObjectId } from "mongodb";
import client from "../common/dbconn.js";
import { Actor } from "./actor.js"

const actorCollection = client.db("cine").collection("actores");
const peliculaCollection = client.db("cine").collection("peliculas");

async function handleInsertActorRequest(req, res) {
  try {
    const data = req.body;

    // encontrar pelicula
    let oid;
    try {
      oid = ObjectId.createFromHexString(data.idPelicula);
    } catch (e) {
      return res.status(400).send("idPelicula no es un ObjectId válido");
    }

    const pelicula = await peliculaCollection.findOne({ _id: oid });
    if (!pelicula) {
      return res.status(404).send("La película indicada no existe");
    }


    const actor = {};
    actor.nombre = data.nombre;
    actor.edad = data.edad; // si quieres, puedes hacer Number(data.edad)
    actor.estaRetirado = data.estaRetirado;
    actor.premios = Array.isArray(data.premios) ? data.premios : [];
    actor.idPelicula = oid;

    const result = await actorCollection.insertOne(actor);

    if (!result || !result.insertedId) {
      return res.status(400).send("Error al guardar registro");
    }
    return res.status(201).send({ _id: result.insertedId });
  } catch (e) {
    return res.status(500).send({ error: e.message });
  }
}

async function handleGetActoresRequest(req, res) {
    await actorCollection.find({}).toArray()
    .then( (data) => { return res.status(200).send(data) } )
    .catch( (e) => { return res.status(500).send( { error: e} ) } )
    
}

async function handleGetActorByIdRequest(req, res) {
    let id = req.params.id

    try{
        let oid = ObjectId.createFromHexString(id)

        await actorCollection.findOne( {_id: oid} )
        .then( (data) => {
            if(data === null) return res.status(404).send(data)

            return res.status(200).send(data)
        } )
    } catch(e) {
        return res.status(400).send( { error: e.code } )
    }
    
}

async function handleGetActoresByPeliculaIdRequest(req, res) {
  const id_pelicula = req.params.id;

  let oid;
  try {
    oid = ObjectId.createFromHexString(id_pelicula);
  } catch (e) {
    return res.status(400).send("El id no es un ObjectId válido");
  }

  peliculaCollection.findOne({ _id: oid })
    .then(function(pelicula) {
      if (!pelicula) {
        return res.status(404).send("La película indicada no existe");
      }
      return actorCollection.find({ idPelicula: oid }).toArray();
    })
    .then(function(actores) {
      if (!res.headersSent) {
        return res.status(200).send(actores || []);
      }
    })
    .catch(function(err) {
      return res.status(500).send({ error: err.message });
    });
}

export default {
    handleInsertActorRequest,
    handleGetActoresRequest,
    handleGetActoresByPeliculaIdRequest,
    handleGetActorByIdRequest
}