import express from "express"
import List from "./routes/list.js"
import Details from "./routes/details.js"

const app = express()
app.use(express.json())

app.get("/products", List)
app.get("/products/:id", Details)

app.listen(3000, () => console.log("server runnin in port 3000"))