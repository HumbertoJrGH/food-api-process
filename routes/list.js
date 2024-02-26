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

		return Array.from(list).filter((product) => {
			const id = product.querySelector("a").href.split("/")[4]
			const name = product.querySelector(".list_product_name").innerText

			const scoreNutrition = product.querySelector(".list_product_sc img.list_product_icons[title^='Nutri-Score']").title.split(" - ")[0].slice(-1)
			const scoreNova = product.querySelector(".list_product_sc img.list_product_icons[title^='NOVA']").title.split(" - ")[0].slice(-1)
			const nutrition = {}
			const nova = {}

			nutrition = {
				score: product.querySelector(".list_product_sc img.list_product_icons[title^='Nutri-Score']").title.split(" - ")[0].length == 13
					? product.querySelector(".list_product_sc img.list_product_icons[title^='Nutri-Score']").title.split(" - ")[0].slice(-1)
					: product.querySelector(".list_product_sc img.list_product_icons[title^='Nutri-Score']").title.split(" - ")[0],
				title: product.querySelector(".list_product_sc img.list_product_icons[title^='Nutri-Score']").title.split(" - ")[1]
			}

			nova = {
				score: product.querySelector(".list_product_sc img.list_product_icons[title^='NOVA']").title.split(" - ")[0].length == 6
					? product.querySelector(".list_product_sc img.list_product_icons[title^='NOVA']").title.split(" - ")[0].slice(-1)
					: product.querySelector(".list_product_sc img.list_product_icons[title^='NOVA']").title.split(" - ")[0],
				title: product.querySelector(".list_product_sc img.list_product_icons[title^='NOVA']").title.split(" - ")[1]
			}

			if (validadeReq(req.params.nutrition, scoreNutrition, req.params.nova, scoreNova))
				return { id, name, nutrition, nova }
		})
	})

	console.log("terminou a captura")
	console.log(products)

	await browser.close()

	res.json(products)
}

function validadeReq(minScoreNutri, scoreNutri, minScoreNova, scoreNova) {
	let nutriV = false
	let novaV = scoreNova >= minScoreNova

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

	return nutriV && novaV
}