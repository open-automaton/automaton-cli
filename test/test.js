const should = require('chai').should();

let tool = require('../src/tools.js')

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
});
