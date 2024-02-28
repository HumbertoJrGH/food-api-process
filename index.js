import express from "express"
import List from "./routes/list.js"
import Details from "./routes/details.js"
import swaggerAutogen from "swagger-autogen"
import swaggerUI from "swagger-ui-express"
import sgFile from "./swagger-output.json" assert {type: "json"}


const app = express()
app.use(express.json())

// ROTAS DISPONÍVEIS
app.get("/products", List)
app.get("/products/:id", Details)

swaggerAutogen()("./swagger-output.json", ["./index.js"], {
	info: {
		title: "Web Scrapper Food API",
		description: "Esta API retorna informações de alimentos e suas respectivas notas da nutrition e nova."
	},
	"paths": {
		"/products": {
			"get": {
				"parameters": [
					{
						"name": "nutrition",
						"in": "query",
						"description": "Filtrar produtos pela nota Nutrition de A até E",
						"required": false,
						"type": "string"
					},
					{
						"name": "nova",
						"in": "query",
						"description": "Filtrar produtos pela nota Nutrition de 0 à 10",
						"required": false,
						"type": "number"
					}
				],
				"description": "",
				"responses": {
					"default": {
						"description": ""
					}
				}
			}
		},
		"/products/{id}": {
			"get": {
				"description": "",
				"responses": {
					"default": {
						"description": ""
					}
				}
			}
		}
	}
})

app.use('/docs', swaggerUI.serve, swaggerUI.setup(sgFile))

app.listen(3000, () => console.log("Servidor rodando na porta: 3000, acesse localhost:3000"))