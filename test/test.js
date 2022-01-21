const should = require('chai').should();
const tool = require('../src/tools.js');
const path = require('path');

const hasArgument = (arg, str)=>{
    return !!(str.match(new RegExp('\-\-'+arg)));
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
        it('outputs test', (done)=>{
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
    });
});
