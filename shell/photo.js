const request = require('request');
const fs = require('fs');
const PHOTO_API_KEY = "563492ad6f91700001000001b20ca47cb5e84fc4bd9c31aef18f1985";
const run = (name) => {
    let url = "https://api.pexels.com/v1/search?query=" + name;
    const out = []
    return new observable(o => {
        const next = () => {
            const options = {
                url,
                headers: {
                    'Authorization': PHOTO_API_KEY
                }
            };
            request(options, read);
        }
        const read = (error, response, body) => {
            const info = JSON.parse(body);
            info.photos.map(p => out.push(p));
            fs.writeFileSync(name + '.json', JSON.stringify(out))
            if (info.next_page) {
                url = info.next_page;
                console.log(url);
                wait(19000).subscribe(next);
                return;
            }
            o.next(out)
        };
        next();
    })
}


 const wait = (ms) => {
     return new observable(o => {
         console.log('waiting %sms', ms)
        let d = new Date().getTime();
        let t = d + ms;
        while (d < t) {
            d = new Date().getTime()
        }
        o.next();
     })
 }

class observable {
    constructor(f) { this.f = f }
    subscribe(next) { this.f({ next }); }
}

run('berlin').subscribe(console.log)