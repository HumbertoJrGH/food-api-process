import puppeteer from "puppeteer";
/**
 *
 * /products:
 * 	get:
 * 		summary: Retorna produtos listados bla bla
 * 		description:
 * 		parameters:
 * 			 - in: query
 * 				name: nutrition
 *					description: Filtrar produtos pela nota Nutrition de A até E
 *					required: false
 *					type: string
 */
export default async function List(req, res) {
    const novaParam = req.query.nova;
    const nutritionParam = req.query.nutrition;
    try {
        console.log("iniciando captura das informações");
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto("https://br.openfoodfacts.org/", {
            waitUntil: "domcontentloaded"
        });
        console.log("capturando informações dos alimentos");
        const products = await page.evaluate(() => {
            const list = document.querySelectorAll("ul.search_results li");
            return Array.from(list).map((product) => {
                const id = product.querySelector("a")?.href.split("/")[4] ?? "";
                const nameEl = product.querySelector(".list_product_name");
                const name = nameEl?.innerText ?? "";
                const nutrition = {
                    score: product.querySelector(".list_product_sc img.list_product_icons[title^='Nutri-Score']").title.split(" - ")[0].length == 13
                        ? product.querySelector(".list_product_sc img.list_product_icons[title^='Nutri-Score']").title.split(" - ")[0].slice(-1)
                        : product.querySelector(".list_product_sc img.list_product_icons[title^='Nutri-Score']").title.split(" - ")[0],
                    title: product.querySelector(".list_product_sc img.list_product_icons[title^='Nutri-Score']").title.split(" - ")[1]
                };
                const nova = {
                    score: product.querySelector(".list_product_sc img.list_product_icons[title^='NOVA']").title.split(" - ")[0].length == 6
                        ? +product.querySelector(".list_product_sc img.list_product_icons[title^='NOVA']").title.split(" - ")[0].slice(-1)
                        : product.querySelector(".list_product_sc img.list_product_icons[title^='NOVA']").title.split(" - ")[0],
                    title: product.querySelector(".list_product_sc img.list_product_icons[title^='NOVA']").title.split(" - ")[1]
                };
                return { id, name, nutrition, nova };
            });
        });
        let result = [];
        if (novaParam && nutritionParam)
            result = products.filter(product => product.nova.score >= novaParam && product.nutrition.score <= nutritionParam);
        else if (novaParam)
            result = products.filter(product => product.nova.score >= novaParam);
        else if (nutritionParam)
            result = products.filter(product => product.nutrition.score <= nutritionParam);
        else
            result = products;
        console.log(`terminou a captura, ${result.length} produtos encontrados.`);
        await browser.close();
        if (result.length > 0)
            res.status(200).json(result);
        else
            res.status(204).json([]);
    }
    catch {
        res.status(500).json({});
    }
}
