import express from "express"
import swaggerUI from "swagger-ui-express"
import sgFile from "./swagger-output.json" assert {type: "json"}
import router from "./routes.js"

const app = express()
app.use(express.json())

// ROTAS DISPONÍVEIS

app.use("/docs", swaggerUI.serve, swaggerUI.setup(sgFile))
app.use("/", router)

app.listen(3000, () => console.log("Servidor rodando na porta: 3000, acesse localhost:3000"))