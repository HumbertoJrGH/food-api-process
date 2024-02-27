import express from "express"
import puppeteer from "puppeteer"

export default async function List(req, res) {
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

			const scoreNutrition = product.querySelector(".list_product_sc img.list_product_icons[title^='Nutri-Score']").title.split(" - ")[0].slice(-1)
			const scoreNova = product.querySelector(".list_product_sc img.list_product_icons[title^='NOVA']").title.split(" - ")[0].slice(-1)

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
	console.log("terminou a filtragem")
	console.log(result)

	await browser.close()

	res.json(result)
}

function validadeReq(minScoreNutri, scoreNutri, minScoreNova, scoreNova) {
	let nutriV = false
	let novaV = true
	if (minScoreNova)
		novaV = scoreNova >= minScoreNovas

	if (minScoreNutri)
		switch (minScoreNutri) {
			case "A":
				if (scoreNutri == "A") nutriV = true
				break
			case "B":
				if (["A", "B"].includes(scoreNutri)) nutriV = true
				break
			case "C":
				if (["A", "B", "C"].includes(scoreNutri)) nutriV = true
				break
			case "D":
				if (["A", "B", "C", "D"].includes(scoreNutri)) nutriV = true
				break
			default: nutriV = true
		}
	else nutriV = true

	return nutriV && novaV
}