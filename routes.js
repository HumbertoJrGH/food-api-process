import express from "express"
import List from "./routes/list.js"
import Details from "./routes/details.js"

const router = express.Router()

router.get("/products", List)
router.get("/products/:id", Details)

export default router