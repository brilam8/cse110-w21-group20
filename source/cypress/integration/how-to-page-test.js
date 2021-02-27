describe('how to page Tests', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8080/HTML/how-to-page.html');
    });
    it("sample test", ()=>{
        expect(true).to.equal(true);
    });
});