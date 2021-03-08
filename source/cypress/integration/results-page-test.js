describe('results page Tests', () => {
    beforeEach(() => {
        cy.on('uncaught:exception', () => { 
            // cypress conflicts with jest for your file. throws error "module is not defined"
            // this ignores it
            return false;
        })
        cy.visit('http://127.0.0.1:5500/HTML/results-page.html');
    });
    it('Clicking restart button will redirect to landing page', () => {
        cy.get('#restartBtn').click();
        cy.url().should('eq', 'http://127.0.0.1:5500/HTML/landing-page.html');
    });
    it(`should call Print dialog`, () => {
        let printStub;
        cy.window().then(win => { 
            printStub = cy.stub(win, 'print');
            cy.get('#print').click();
            cy.wasCalled(printStub);
        })
    })
    it(`should add tasks to finished list`, () => {
        window.localStorage.setItem('tasks', JSON.stringify([
            {
              "id": 1,
              "actualpomos": 4,
              "expectedpomos" : 5,
              "completed": true,
              "taskdescription": "eat cheese"
            },
            {
              "id": 2,
              "actualpomos": 2,
              "expectedpomos" : 5,
              "completed": true,
              "taskdescription": "play games"
            },
            {
              "id": 3,
              "actualpomos": 3,
              "expectedpomos" : 5,
              "completed": false,
              "taskdescription": "finish cse 110"
            },
            {
              "id": 4,
              "actualpomos": 0,
              "expectedpomos" : 5,
              "completed": true,
              "taskdescription": "take a trip downtown"
            },
            {
              "id": 5,
              "actualpomos": 6,
              "expectedpomos" : 5,
              "completed": true,
              "taskdescription": "build covid 19 vaccine"
            }
        ]));
        cy.reload();
        cy.get('#complete-items').children().should('have.length', 4);
        cy.get('#uncomplete-items').children().should('have.length', 1);
        cy.wait(3000);
        cy.get('#prog-bar-fill').should('have.css', 'background-color', 'rgb(0, 128, 0)');
        cy.get('#prog-num').contains('4/5 tasks');
    })
    it(`should display congratulations message`, () => {
        window.localStorage.setItem('tasks', JSON.stringify([
            {
              "id": 1,
              "actualpomos": 4,
              "expectedpomos" : 5,
              "completed": true,
              "taskdescription": "eat cheese"
            },
            {
              "id": 2,
              "actualpomos": 2,
              "expectedpomos" : 5,
              "completed": true,
              "taskdescription": "play games"
            },
            {
              "id": 3,
              "actualpomos": 3,
              "expectedpomos" : 5,
              "completed": true,
              "taskdescription": "finish cse 110"
            },
            {
              "id": 4,
              "actualpomos": 0,
              "expectedpomos" : 5,
              "completed": true,
              "taskdescription": "take a trip downtown"
            },
            {
              "id": 5,
              "actualpomos": 6,
              "expectedpomos" : 5,
              "completed": true,
              "taskdescription": "build covid 19 vaccine"
            }
        ]));
        cy.reload();
        cy.get('#complete-items').children().should('have.length', 5);
        cy.get('#uncomplete-items').children().should('have.length', 1);
        cy.get('#uncomplete-items').children().contains("No tasks uncompleted");
        cy.wait(3000);
        cy.get('#prog-bar-fill').should('have.css', 'background-color', 'rgb(0, 128, 0)');
        cy.get('#prog-num').contains('5/5 tasks');
        cy.get('#message').contains("Congratulations! You finished");
    })
    it(`should display no tasks completed/uncompleted`, () => {
        cy.get('#complete-items').children().should('have.length', 1);
        cy.get('#uncomplete-items').children().should('have.length', 1);
        cy.get('#uncomplete-items').children().contains("No tasks uncompleted");
        cy.get('#complete-items').children().contains("No tasks completed");
        cy.wait(3000);
        cy.get('#prog-bar-fill').should('have.css', 'background-color', 'rgb(218, 21, 21)');
        cy.get('#prog-num').contains('No tasks were found');
    })
    it(`should display no tasks completed`, () => {
        window.localStorage.setItem('tasks', JSON.stringify([
            {
              "id": 1,
              "actualpomos": 4,
              "expectedpomos" : 5,
              "completed": false,
              "taskdescription": "eat cheese"
            },
            {
              "id": 2,
              "actualpomos": 2,
              "expectedpomos" : 5,
              "completed": false,
              "taskdescription": "play games"
            },
            {
              "id": 3,
              "actualpomos": 3,
              "expectedpomos" : 5,
              "completed": false,
              "taskdescription": "finish cse 110"
            },
            {
              "id": 4,
              "actualpomos": 0,
              "expectedpomos" : 5,
              "completed": false,
              "taskdescription": "take a trip downtown"
            },
            {
              "id": 5,
              "actualpomos": 6,
              "expectedpomos" : 5,
              "completed": false,
              "taskdescription": "build covid 19 vaccine"
            }
        ]));
        cy.reload();
        cy.get('#complete-items').children().should('have.length', 1);
        cy.get('#uncomplete-items').children().should('have.length', 5);
        cy.get('#complete-items').children().contains("No tasks completed");
        cy.wait(3000);
        cy.get('#prog-bar-fill').should('have.css', 'background-color', 'rgb(218, 21, 21)');
        cy.get('#prog-num').contains('0/5 tasks');
    })
});

Cypress.Commands.add('wasCalled', (stubOrSpy) => {
    expect(stubOrSpy).to.be.called;
})