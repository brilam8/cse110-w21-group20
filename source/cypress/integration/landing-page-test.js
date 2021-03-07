describe('landing page Tests', () => {
    beforeEach(() => {
        cy.visit('http://127.0.0.1:5500/HTML/landing-page.html');
    });
    it("sample test", ()=>{
        expect(true).to.equal(true);
    });
});