const Automaton = require('@open-automaton/automaton');
const DOM = require('@open-automaton/automaton/src/dom-tool.js').DOM;
const CheerioEngine = require('@open-automaton/cheerio-mining-engine');
const PuppeteerEngine = require('@open-automaton/puppeteer-mining-engine');
const exec = require('child_process').exec;

let fileCache = {};
let options = {
    cache: false,
    pretty: true,
    format: 'JSON'
};

module.exports = {
    clExecute : (command, cb)=>{
        let child = exec(command,
          function (err, stdout, stderr){
              let error = err || (stderr && new Error(stderr));
              if(error) console.log('exec error: ' + error);
              cb(error, (!error) && stdout);
        });
    },
    selectXpath : (selector, value, callback)=>{
        let selection = DOM.xpathText(selector, value);
        setTimeout(()=>{
            callback(null, selection);
        });
    },
    selectRegex : (selector, value, callback)=>{
        let selection = DOM.regexText(selector, value);
        setTimeout(()=>{
            callback(null, selection);
        });
    },
    performScrape : (filename, callback)=>{
        if(options.cache){
            if(fileCache[filename]){
                return setTimeout(()=>{
                    callback(null, fileCache[filename]);
                })
            }
        }
        fs.readFile(filename, (err, body)=>{
            let bodyString = body.toString();
            if(options.cache) fileCache[filename] = bodyString;
            (new Automaton(
                bodyString,
                new AutomatonPuppeteerEngine()
            )).run((err, data)=>{
                switch(options.format.toLowerCase()){
                    case 'json':
                        if(options.pretty){
                            callback(null, JSON.stringify( data, null, '    '));
                        }else{
                            callback(null, JSON.stringify(data));
                        }
                        break;
                    default: callback(new Error('Unknown Format: '+options.format));
                }
            });
        });
    },
    //static options for the class
    option : (name, value)=>{
        optons[name] = value;
        return optons[name];
    }
};
