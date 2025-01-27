const fs = require('fs');
const http = require('http');


//////////////////////////////
////// FILES
// Blocking, synchronous way
// const hellp = 'Hello World';
// console.log(hellp); 

// const textIn = fs.readFileSync('input.txt', 'utf-8');
// console.log(textIn);

// const testOut = `This is what we know about the avacado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('output.txt', testOut);
// console.log('File written!');

// Non-blocking, asynchronous way
// fs.readFile('start.txt', 'utf-8', (err, data) => {
//     console.log(data);
//     fs.readFile(`${data}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile(`append.txt`, 'utf-8', (err, data3) => {
//             console.log(data3);
//             fs.writeFile('final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//                 console.log('Your file has been written');
//             })
//         })
//     })
// })
// console.log('waiting for file to read');

//////////////////////////////
////// SERVER
const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);

    if (!product.organic) {
        output = output.replace(/{%NOT_ORGANIC%}/g, 'not organic');
        output = output.replace(/{%ORGANIC%}/g, '');
    } 
    else {
        //output = output.replace('<div class="card__detail-box {%NOT_ORGANIC%}">', '');
        //output = output.replace('</div>', '');
        output = output.replace(/{%ORGANIC%}/g, 'organic');
        output = output.replace(/{%NOT_ORGANIC%}/g, '');
    }
  
    return output;
};
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
    console.log(req.url);
    const pathName = req.url;

    // Overview page
    if (pathName === '/' || pathName === '/overview') {
        res.writeHead(200, {'Content-type': 'text/html'});
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace(`{%PRODUCT_CARDS%}`, cardsHtml);
        res.end(output);
  //      res.end('This is the OVERVIEW');
    
    // Product page
    } else if (pathName === '/product') {
        res.end('This is the PRODUCT');
    
    // API
    } else if (pathName === '/api') {
        res.writeHead(200, {'Content-type': 'application/json'});
        res.end(data);

    // Not found    
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
         });
        res.end('<h1>Page not found!</h1>');
    }

    //res.end('Hello from the server!');
});

server.listen(8000, '127.0.0.1' , () => {
    console.log('Listening to requests on port 8000');
})