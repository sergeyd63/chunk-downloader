const download = require('./download');

let args = process.argv.slice(2);
// http://028eed10.bwtest-aws.pravala.com/384MB.jar
let url = args[0];
let chunksParam = args[1] || 4;
let chunkSize = parseInt(4194304 / chunksParam);
console.log(`Chunks: ${chunksParam}`);
console.log(`Chunk size: ${chunkSize}`);

if (!url) {
    console.log('You must provide URL value');
    return;
}


download(url, chunksParam, chunkSize);