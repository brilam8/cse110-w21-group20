describe('how to page Tests', () => {
    beforeEach(() => {
        cy.visit('http://127.0.0.1:5500/source/HTML/how-to-page.html');
    });
    it("sample test", ()=>{
        expect(true).to.equal(true);
    });
});