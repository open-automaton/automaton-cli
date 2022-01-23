const should = require('chai').should();
const tool = require('../src/tools.js');
const path = require('path');
const arrays = require('async-arrays');
const fs = require("fs");
const os = require("os");

const hasArgument = (arg, str)=>{
    return !!(str.match(new RegExp('\-\-'+arg)));
}

const makeTempFile = (body, cb)=>{
    let name = path.join(os.tmpdir(), Math.floor(Math.random()*1000000)+'.temp');
    fs.writeFile(name, body, (err)=>{
        cb(err, (!err) && name, (callback)=>{
            fs.unlink(name, callback);
        });
    });
}

describe('automaton-cli', ()=>{
    describe('cli-tool', ()=>{
        it('selects xpath', ()=>{
            tool.selectXpath('//span', `
                <div>
                    <span>something</span>
                    <b>anotherthing</b>
                </div>
            `, (err, selection)=>{
                should.not.exist(err);
            });
        });

        it.skip('selects regex', ()=>{
            tool.selectRegex('.*', `
                <div>
                    <span>something</span>
                    <b>anotherthing</b>
                </div>
            `, (err, selection)=>{
                should.not.exist(err);
                console.log(selection);
            });
        });
    });
    describe('cli', ()=>{
        it('outputs help', (done)=>{
            tool.clExecute(
                path.join(
                    __dirname, '..', 'bin', 'auto'
                )+' --help', (err, output)=>{
                    hasArgument('help', output).should.equal(true);
                    hasArgument('version', output).should.equal(true);
                    hasArgument('data', output).should.equal(true);
                    hasArgument('puppeteer-chromium', output).should.equal(true);
                    hasArgument('playwright-chromium', output).should.equal(true);
                    hasArgument('playwright-webkit', output).should.equal(true);
                    hasArgument('playwright-firefox', output).should.equal(true);
                    hasArgument('cheerio', output).should.equal(true);
                    hasArgument('jsdom', output).should.equal(true);
                    hasArgument('a-missing-flag', output).should.equal(false);
                    done();
                }
            );
        });

        it('outputs xpath', (done)=>{
            makeTempFile(`
            <table>
                <thead>
                    <tr>
                        <th>id</th>
                        <th>name</th>
                        <th>value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                       <th>a-3849834</th>
                       <th>something</th>
                       <th>247</th>
                    </tr>
                    <tr>
                       <th>a-3845464</th>
                       <th>something-else</th>
                       <th>212</th>
                    </tr>
                    <tr>
                       <th>a-3832327</th>
                       <th>something-different</th>
                       <th>56</th>
                    </tr>
                </tbody>
            </table>`, (err, filename, deleteFile)=>{
                should.not.exist(err);
                let command = path.join(
                    __dirname, '..', 'bin', 'auto'
                )+' xpath //tr '+filename;
                tool.clExecute(
                    command, (exerr, output)=>{
                        should.not.exist(exerr);
                        let data = null;
                        try{
                            data = JSON.parse(output);
                        }catch(ex){
                            should.not.exist(ex);
                        }
                        Array.isArray(data).should.equal(true);
                        data.length.should.equal(4);
                        deleteFile((delError)=>{
                            should.not.exist(delError);
                            done();
                        });
                    }
                );
            });
        });

        it('scrapes automaton-cli github', function(done){
            this.timeout(10000);
            let tableRowSelector = "//div[@role='row']";
            let columnValueSelector = "//div/span/a/text()";
            let command = path.join(
                __dirname, '..', 'bin', 'auto'
            )+' fetch http://github.com/open-automaton/automaton-cli ';
            tool.clExecute(
                command, (exerr, output)=>{
                    should.not.exist(exerr);
                    let results = {};
                    tool.selectXpath(tableRowSelector, output, (err, rows)=>{
                        arrays.forEachEmission(rows, (row, index, complete)=>{
                            tool.selectXpath(
                                columnValueSelector,
                                rows[index] || [],
                                (err, selection)=>{
                                    should.not.exist(err);
                                    if(selection.length){
                                        results[selection[0]] = selection[1];
                                    }
                                    complete();
                                }
                            );
                        }, ()=>{
                            should.exist(results['README.md']);
                            should.exist(results['package.json']);
                            should.exist(results['bin']);
                            done();
                        });
                    });
                }
            );
        });
    });
});
