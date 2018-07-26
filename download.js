var fs = require('fs');
const http = require('http');
const CombinedStream = require('combined-stream');

var download = (chunks) => {

    let allP = [];

    for (let index = 1; index <= chunks; index++) {
        allP[index - 1] = new Promise((resolve, reject) => {
            var file = fs.createWriteStream(`part.file.${index}`);
            let opt = {
                hostname: '028eed10.bwtest-aws.pravala.com',
                port: 80,
                path: '/384MB.jar',
                headers: {
                    'Range': `bytes=${(index - 1) * 1048576}-${index * 1048576}`
                }
            };

            var request = http.get(opt, (res) => {
                var downloaded = 0;

                res.on('data', function (chunk) {
                    file.write(chunk);
                    downloaded += chunk;
                }).on('end', function () {
                    file.end();
                    resolve(`part.file.${index}`);
                }).on('error', function (err) { });
            });

        });
    }

    Promise.all(allP).then(function (values) {
        let combinedStream = CombinedStream.create();
        values.map((file) => {
            combinedStream.append(fs.createReadStream(file));
        });

        combinedStream.pipe(fs.createWriteStream('result.jar'));

        values.map((file) => {
            fs.unlink(file);
        });
    });
};

module.exports = download;