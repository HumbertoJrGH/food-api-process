import express, { Request, Response } from "express"
import puppeteer from "puppeteer"

export default async function List(req: Request, res: Response) {
	// PARÂMETROS OPCIONAIS
	const novaParam = req.query.nova
	const nutritionParam = req.query.nutrition

	try {
		console.log("iniciando captura das informações")

		const browser = await puppeteer.launch()
		const page = await browser.newPage()

		await page.goto("https://br.openfoodfacts.org/", {
			waitUntil: "domcontentloaded"
		})

		console.log("capturando informações dos alimentos")
		const products = await page.evaluate(() => {
			const list = document.querySelectorAll("ul.search_results li")

			return Array.from(list).map((product: Element) => {
				const id = product.querySelector("a")?.href.split("/")[4] ?? ""
				const nameEl: HTMLElement = product.querySelector(".list_product_name") as HTMLElement
				const name = nameEl?.innerText ?? ""

				const nutrition = {
					score: (product.querySelector(".list_product_sc img.list_product_icons[title^='Nutri-Score']") as HTMLElement).title.split(" - ")[0].length == 13
						? (product.querySelector(".list_product_sc img.list_product_icons[title^='Nutri-Score']") as HTMLElement).title.split(" - ")[0].slice(-1)
						: (product.querySelector(".list_product_sc img.list_product_icons[title^='Nutri-Score']") as HTMLElement).title.split(" - ")[0],
					title: (product.querySelector(".list_product_sc img.list_product_icons[title^='Nutri-Score']") as HTMLElement).title.split(" - ")[1]
				}

				const nova = {
					score: (product.querySelector(".list_product_sc img.list_product_icons[title^='NOVA']") as HTMLElement).title.split(" - ")[0].length == 6
						? +(product.querySelector(".list_product_sc img.list_product_icons[title^='NOVA']") as HTMLElement).title.split(" - ")[0].slice(-1)
						: (product.querySelector(".list_product_sc img.list_product_icons[title^='NOVA']") as HTMLElement).title.split(" - ")[0],
					title: (product.querySelector(".list_product_sc img.list_product_icons[title^='NOVA']") as HTMLElement).title.split(" - ")[1]
				}
				return { id, name, nutrition, nova }
			})
		})

		// PREPARANDO RESULTADO EM BASE DOS DADOS OBTIDOS PELO WEBSCRAPPING
		let result = []
		if (novaParam && nutritionParam)
			result = products.filter(product => product.nova.score >= novaParam && product.nutrition.score <= nutritionParam)
		else if (novaParam)
			result = products.filter(product => product.nova.score >= novaParam)
		else if (nutritionParam)
			result = products.filter(product => product.nutrition.score <= nutritionParam)
		else result = products
		console.log(`terminou a captura, ${result.length} produtos encontrados.`)

		// FECHANDO O NAVEGADOR VIRTUAL
		await browser.close()

		if (result.length > 0)
			res.status(200).json(result)
		else
			res.status(204).json([])
	} catch (err) {
		console.error("erro ao trazer informações dos produtos")
		res.status(500).json({ err })
	}
}