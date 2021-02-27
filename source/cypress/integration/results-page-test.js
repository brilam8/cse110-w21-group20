describe('results page Tests', () => {
    beforeEach(() => {
        cy.on('uncaught:exception', (err, runnable) => { 
            // cypress conflicts with jest for your file. throws error "module is not defined"
            // this ignores it
            return false;
        })
        cy.visit('http://127.0.0.1:5500/HTML/results-page.html');
    });
    it("sample test", ()=>{
        expect(true).to.equal(true);
    });
});
