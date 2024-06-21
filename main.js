const http = require("http");
const fsPromises = require("fs/promises");
const fs = require("fs");
const url = require("url");

const dataText = fs.readFileSync(`${__dirname}/data.json`);
const data = JSON.parse(dataText);

console.log(__dirname);

const app = http.createServer(async (req, res) => {
    res.writeHead(200, {
        "Content-Type": "text/html",
    });
    const { query, pathname } = url.parse(req.url, true);

    switch (pathname) {
        case "/": {
            const bf = await fsPromises.readFile(`${__dirname}/pages/homepage.html`);
            res.end(bf);
            break;
        }
        case "/products": {
            const bf = await fsPromises.readFile(`${__dirname}/pages/productsPage.html`);
            let text = bf.toString();
            let productsText = "";
            for (let i = 0; i < data.length; i++) {
                productsText += `<div class="product-card">
                        <h3>${data[i].title}</h3>
                        <img src="${data[i].thumbnail}" alt='product-image' height='200'>
                        <p>${data[i].description}</p>
                        <a href="/view?id=${data[i].id}" target="_blank">More</a>
                    </div>`;
            }
            text = text.replace("$PRODUCTS$", productsText);
            res.end(text);
            break;
        }
        case "/view": {
            const product = data.find((elem)=>{
                if (elem.id == query.id) return true;
                else return false;
            });
            
            res.end(`<div>
                        <h2>${product.title}</h2>
                        <img src="${product.thumbnail}" alt='product-image' height='200'>
                        <h4>${product.price}</h4>
                        <p>${product.description}</p>
                </div>`);
            break;
        }
        
        default: {
            res.end("<h2>Oops! Page not found...</h2>");
        }
    }
});

app.listen(1400, () => {
    console.log("--------- Server Started ----------");
});