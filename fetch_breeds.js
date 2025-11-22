const fs = require('fs');
const https = require('https');

const url = 'https://api.thedogapi.com/v1/breeds';

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        fs.writeFileSync('raw_breeds.json', data);
        console.log('Done');
    });
}).on('error', (e) => {
    console.error(e);
});
