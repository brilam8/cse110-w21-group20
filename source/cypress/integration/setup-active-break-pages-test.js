describe('setup-active-break-pages Tests', () => {
    beforeEach(() => {
        cy.visit('http://127.0.0.1:5500/HTML/setup-active-break-pages.html'); 
    });
    it("sample test", ()=>{
        expect(true).to.equal(true);
    });

    it('Clicking how-to-page button will redirect to how-to-page.html', () => {
        cy.get('#to-how-to-page').click();
        cy.url().should('eq', 'http://127.0.0.1:5500/HTML/how-to-page.html');
    });
});