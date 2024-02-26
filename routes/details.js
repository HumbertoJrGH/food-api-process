import express from "express"
import puppeteer from "puppeteer"

export default async function Details(req, res) {
	console.log("iniciando captura das informações")

	const browser = await puppeteer.launch()
	const page = await browser.newPage()

	console.log(`capturando informações do alimento ${req.params.id}`)
	await page.goto(`https://br.openfoodfacts.org/produto/${req.params.id}`, {
		waitUntil: "domcontentloaded"
	})

	const info = await page.evaluate(async () => {
		const product = document.querySelector("#prodInfos .card-section")

		const title = product.querySelector(".title-1").innerText
		const quantity = product.querySelector("p#field_quantity .field_value").innerText

		const analysis = document.querySelectorAll("#panel_ingredients_analysis_content ul.accordion")

		const ingredients = {
			hasPalmOil: analysis[0].id.substr(30).replace("-palm-oil", ""),
			isVegan: document.querySelector("#panel_ingredients_analysis_en-vegan") ? true : false,
			isVegetarian: document.querySelector("panel_ingredients_analysis_en-vegetarian") ? true : false,
			list: document.querySelector("#panel_ingredients_content .panel_text").innerText.split(", ")
		}

		const score = document.querySelector("#panel_nutriscore li a").className.split("grade_")[1].toUpperCase()

		let nutrition = {}

		const table = document.querySelector("#panel_nutrition_facts_table_content table")
		const tableData = [];

		// Loop through table rows (excluding the header)
		const tableRows = table.querySelectorAll('tbody tr');
		for (const row of tableRows) {
			const rowData = {};

			// Extract data from the first two cells (assuming consistent structure)
			const dataCells = row.querySelectorAll('td');
			rowData.Nome = dataCells[0].querySelector('span').textContent.trim();
			rowData.Valor = dataCells[1].querySelector('span').textContent.trim();

			tableData.push(rowData);
		}

		if (ingredients.list[0].includes(":"))
			ingredients.list[0] = ingredients.list[0].split(": ")[1]

		const values = []

		if (score) {
			const listValues = document.querySelectorAll("#panel_nutrient_levels_content ul.accordion")

			await listValues.forEach(async item => {
				values.push([
					item.querySelector("a img").src.slice(45).split(".")[0],
					item.querySelector("a h4").innerText
				])
			})

			nutrition = {
				score: score,
				values: values,
				servingSize: document.querySelector("#panel_serving_size_content .panel_text").innerText.split(": ")[1],
				data: tableData
			}
		} else
			nutrition = {
				score: "unknown"
			}

		const nova = {
			score: document.querySelector("#panel_nova li a img").src.slice(-5).slice(0, 1),
			title: document.querySelector("#panel_nova a h4").innerText
		}

		return { title, quantity, ingredients, nutrition, nova }
	})

	console.log("captura finalizada com sucesso")
	await browser.close()

	res.json(info)
}