describe('landing page Tests', () => {
    beforeEach(() => {
        cy.visit('http://127.0.0.1:8080/HTML/landing-page.html');
    });
    it("sample test", ()=>{
        expect(true).to.equal(true);
    });
});