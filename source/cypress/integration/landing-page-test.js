describe('landing page Tests', () => {
    beforeEach(() => {
        cy.visit('http://127.0.0.1:5500/HTML/landing-page.html');
    });
    it("sample test", ()=>{
        expect(true).to.equal(true);
    });

    it("Start button redirect to setup", () => {
        cy.get('#to-set-up').click();
        cy.url().should('eq', 'http://127.0.0.1:5500/HTML/setup-active-break-pages.html');
    });

    it("How to goes to correct page", () => {
        cy.get('#to-how-to').click();
        cy.url().should('eq', 'http://127.0.0.1:5500/HTML/how-to-page.html');
    });
});