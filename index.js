import express from "express"
import List from "./routes/list.js"
import Details from "./routes/details.js"

const app = express()
app.use(express.json())

// ROTAS DISPONÍVEIS
app.get("/products", List)
app.get("/products/:id", Details)

app.listen(3000, () => console.log("Servidor rodando na porta: 3000, acesse localhost:3000"))