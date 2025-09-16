import express, { urlencoded } from 'express'
import cors from 'cors'

import client from './src/common/dbconn.js'
import peliroutes from './src/pelicula/routes.js'
import actorroutes from './src/actor/routes.js'

const PORTS = 3000 || 3001
const app = express()

app.use(express.json())
app.use(urlencoded({ extended: true }))
app.use(cors())

app.all('/', (req, res) => { return res.status(200).send('Bienvenido al cine') } )

app.use('/api', peliroutes)
app.use('/api', actorroutes)

await client.connect()
.then( () => {
    console.log('Conectado al clúster')
    app.listen(PORTS, () => { console.log(`Servidor corriendo en http://localhost:${PORTS}`) })
} )
.catch( () => {
    console.log('Error al conectar al clúster')
} )



