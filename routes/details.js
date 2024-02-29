import puppeteer from "puppeteer";
export default async function Details(req, res) {
    try {
        console.log("iniciando captura das informações");
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        console.log(`capturando informações do alimento ${req.params.id}`);
        await page.goto(`https://br.openfoodfacts.org/produto/${req.params.id}`, {
            waitUntil: "domcontentloaded"
        });
        // CAPTURANDO INFORMAÇÕES DA PÁGINA
        const info = await page.evaluate(async () => {
            const product = document.querySelector("#prodInfos .card-section");
            // CAPTURANDO INFORMAÇÕES BÁSICAS DO PRODUTO E FORMANDO OBJETOS PARA COMPOR JSON FINAL
            const title = (product && product.querySelector(".title-1")?.innerHTML) ?? null;
            const quantity = (product && product.querySelector("p#field_quantity .field_value")?.innerHTML) ?? null;
            const analysis = document.querySelectorAll("#panel_ingredients_analysis_content ul.accordion");
            const ingredients = {
                hasPalmOil: analysis[0].id.substr(30).replace("-palm-oil", ""),
                isVegan: document.querySelector("#panel_ingredients_analysis_en-vegan") ? true : false,
                isVegetarian: document.querySelector("panel_ingredients_analysis_en-vegetarian") ? true : false,
                list: document.querySelector("#panel_ingredients_content .panel_text")?.innerHTML.split(", ")
            };
            // PREPARANDO TABELA DE DETALHES NUTRICIONAIS
            const table = document.querySelector("#panel_nutrition_facts_table_content table");
            const tableData = [];
            // ITERANDO SOBRE A TABELA
            const tableRows = table?.querySelectorAll('tbody tr');
            tableRows?.forEach(row => {
                const rowData = {
                    Nome: "",
                    Valor: ""
                };
                // EXTRAINDO VALORES DE CADA LINHA (NOME - VALOR)
                const dataCells = row.querySelectorAll('td');
                rowData.Nome = dataCells[0].querySelector('span')?.textContent?.trim() ?? "";
                rowData.Valor = dataCells[1].querySelector('span')?.textContent?.trim() ?? "";
                tableData.push(rowData);
            });
            if (ingredients && ingredients.list && ingredients.list[0] && ingredients.list[0].includes(":"))
                ingredients.list[0] = ingredients.list[0].split(": ")[1];
            const values = [];
            // VALIDA SE TEM SCORE DA NUTRITION DISPONÍVEL PARA CAPTURAR DETALHES
            const score = document.querySelector("#panel_nutriscore li a")?.className.split("grade_")[1].toUpperCase();
            let nutrition = {};
            if (score) {
                const listValues = document.querySelectorAll("#panel_nutrient_levels_content ul.accordion");
                if (listValues)
                    listValues.forEach(async (item) => {
                        const img = item.querySelector("a img");
                        values.push([
                            img?.src?.slice(45).split(".")[0] ?? "",
                            item.querySelector("a h4")?.innerHTML ?? ""
                        ]);
                    });
                const servingSize = document.querySelector("#panel_serving_size_content .panel_text")?.innerHTML ?? "";
                if (servingSize)
                    servingSize.split(": ")[1] ?? "";
                nutrition = {
                    score: score,
                    values: values,
                    servingSize: servingSize,
                    data: tableData
                };
            }
            else
                nutrition = {
                    score: "unknown"
                };
            const img = document.querySelector("#panel_nova li a img");
            const nova = {
                score: img?.src.slice(-5).slice(0, 1),
                title: document.querySelector("#panel_nova a h4")?.innerHTML
            };
            return { title, quantity, ingredients, nutrition, nova };
        });
        console.log("captura finalizada com sucesso");
        await browser.close();
        if (Object.keys(info).length > 0)
            res.status(200).json(info);
        else
            res.status(204).json({});
    }
    catch (err) {
        console.error("erro ao trazer informações do produto");
        res.status(500).json({ err });
    }
}
