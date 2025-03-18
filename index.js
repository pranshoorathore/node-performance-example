const express = require('express');
const cluster = require('node:cluster');
const os = require('node:os');

const app = express();

function delay(duration){
    let startTime = Date.now();
    while(Date.now() - startTime < duration){
        // event loop blocks here
    }
}
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.get('/timer', (req, res) => {
    let duration = 10000;
    delay(duration);
    res.send(`called timer ${process.pid}`);
});

if(cluster.isMaster){
    console.log(`Master process ${process.pid} is running`);
    const numWorkers = os.cpus().length;
    for(let i = 0; i < numWorkers; i++) {
    cluster.fork();
    }
} else {
    console.log(`Worker process ${process.pid} is running`);
    app.listen(3000, 'localhost', ()=>{
        console.log('Server is running at http://localhost:3000/');
        console.log(process.pid);
        console.log(cluster.isMaster);
    });
}

