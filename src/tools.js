const Automaton = require('@open-automaton/automaton');
const DOM = require('@open-automaton/automaton/src/dom-tool.js').DOM;
const CheerioEngine = require('@open-automaton/cheerio-mining-engine');
const PuppeteerEngine = require('@open-automaton/puppeteer-mining-engine');
const exec = require('child_process').exec;
const fs = require("fs");
const path = require('path');
const os = require("os");

let fileCache = {};
let options = {
    cache: false,
    pretty: true,
    format: 'JSON'
};

const makeTempFile = (body, cb)=>{
    let name = path.join(os.tmpdir(), Math.floor(Math.random()*1000000)+'.temp');
    fs.writeFile(name, body, (err)=>{
        cb(err, (!err) && name, (callback)=>{
            fs.unlink(name, callback);
        });
    });
}

const tool = {
    clExecute : (command, cb)=>{
        let child = exec(command,
          function (err, stdout, stderr){
              let error = err || (stderr && new Error(stderr));
              if(error) console.log('exec error: ' + error);
              cb(error?error:null, stdout);
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
    selectCLIXPath : (selector, value, callback)=>{
        makeTempFile(value, (err, filename, deleteFile)=>{
            if(err) return callback(err);
            let command = path.join(
                __dirname, '..', 'bin', 'auto'
            )+' xpath "'+selector+'" '+filename;
            tool.clExecute(command, (exerr, output)=>{
                deleteFile((delError)=>{
                    callback((exerr || delError), output);
                });
            });
        });
    },
    performCLIScrape : (data, definition, callback)=>{
        makeTempFile(definition, (err, filename, deleteFile)=>{
            if(err) return callback(err);
            let command = path.join(
                __dirname, '..', 'bin', 'auto'
            )+' scrape '+filename;
            tool.clExecute(command, (exerr, output)=>{
                if(exerr) return callback(exerr);
                deleteFile((delErr)=>{
                    if(delErr) return callback(delErr);
                    try{
                        return callback(null, JSON.parse(output));
                    }catch(parseErr){
                        return callback(parseErr);
                    }
                })
            });
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
            if(err) return callback(err);
            let bodyString = body.toString();
            if(options.cache) fileCache[filename] = bodyString;
            let engine = new PuppeteerEngine();
            (new Automaton(bodyString, engine)).run((err, data)=>{
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
        options[name] = value;
        return options[name];
    }
};

module.exports = tool;
