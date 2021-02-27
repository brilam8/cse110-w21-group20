describe('landing page Tests', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8080/HTML/landing-page.html');
    });
    it("sample test", ()=>{
        expect(true).to.equal(true);
    });
});