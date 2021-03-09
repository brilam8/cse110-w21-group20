describe('how to page Tests', () => {
    beforeEach(() => {
        cy.visit('http://127.0.0.1:5500/HTML/how-to-page.html');
    });
    it("sample test", ()=>{
        expect(true).to.equal(true);
    });

    it('Home page button redirects to landing page', () => {
        cy.get('#to-home-page').click();
        cy.url().should('eq', 'http://127.0.0.1:5500/source/HTML/landing-page.html');
    });

    it('Set-up page button redirects to set-up page', () => {
        cy.get('#to-set-up-page').click();
        cy.url().should('eq', 'http://127.0.0.1:5500/source/HTML/setup-active-break-pages.html');
    });
});

