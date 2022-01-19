const should = require('chai').should();
const tool = require('../src/tools.js');
const path = require('path');

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
                console.log(selection);
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
                    done();
                }
            );
        });
    });
});
