describe('how to page Tests', () => {
    beforeEach(() => {
        cy.visit('http://127.0.0.1:8080/HTML/how-to-page.html');
    });
    it("sample test", ()=>{
        expect(true).to.equal(true);
    });
});