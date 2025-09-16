import { MongoClient, ServerApiVersion } from 'mongodb'

const uri = 'mongodb+srv://admin:admin12345@eva-u3-express.svgtmmq.mongodb.net/?retryWrites=true&w=majority&appName=eva-u3-express'

const client = new MongoClient(uri, 
    { serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    } }
)


export default client