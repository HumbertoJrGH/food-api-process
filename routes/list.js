import express from "express"
import puppeteer from "puppeteer"

export default async function List(req, res) {
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

			return Array.from(list).map((product) => {
				const id = product.querySelector("a").href.split("/")[4]
				const name = product.querySelector(".list_product_name").innerText

				const nutrition = {
					score: product.querySelector(".list_product_sc img.list_product_icons[title^='Nutri-Score']").title.split(" - ")[0].length == 13
						? product.querySelector(".list_product_sc img.list_product_icons[title^='Nutri-Score']").title.split(" - ")[0].slice(-1)
						: product.querySelector(".list_product_sc img.list_product_icons[title^='Nutri-Score']").title.split(" - ")[0],
					title: product.querySelector(".list_product_sc img.list_product_icons[title^='Nutri-Score']").title.split(" - ")[1]
				}

				const nova = {
					score: product.querySelector(".list_product_sc img.list_product_icons[title^='NOVA']").title.split(" - ")[0].length == 6
						? +product.querySelector(".list_product_sc img.list_product_icons[title^='NOVA']").title.split(" - ")[0].slice(-1)
						: product.querySelector(".list_product_sc img.list_product_icons[title^='NOVA']").title.split(" - ")[0],
					title: product.querySelector(".list_product_sc img.list_product_icons[title^='NOVA']").title.split(" - ")[1]
				}
				return { id, name, nutrition, nova }
			})
		})

		console.log("terminou a captura")
		let result = []
		if (req.query.nova && req.query.nutrition)
			result = products.filter(product => product.nova.score >= req.query.nova && product.nutrition.score <= req.params.nutrition)
		else if (req.query.nova)
			result = products.filter(product => product.nova.score >= req.query.nova)
		else if (req.query.nutrition)
			result = products.filter(product => product.nutrition.score <= req.query.nutrition)
		else result = products

		await browser.close()

		if (result.length > 0)
			res.status(200).json(result)
		else
			res.status(204).json([])
	} catch {
		res.status(500).json({})
	}
}