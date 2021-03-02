describe('setup Tests', () => {
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

    it('Task list should be length 2', () => {
        cy.get('#active-task-container').children().should('have.length', 2);
    });

    it('Clicking create will create another task, so task list should have length 3', () => {
        cy.get('#create').click();
        cy.get('#active-task-container').children().should('have.length', 3);
    });

    it('Clicking delete will remove a task, so task list should have length 1', () => {
        cy.get('#active-task-container').children().shadow().find('button').click();
        cy.get('#active-task-container').children().should('have.length', 1);
    });

    it('Task should have default value of 1 pomo', () => {
        cy.get('#active-task-container').children().shadow().find('input[type=number]').should('contain.value', 1);
    });

    it('Clicking the up arrow should set task to have value of 2 pomos', () => {
        cy.get('#active-task-container').children().shadow().find('input[type=number]').invoke("val", 2).trigger('change');
        cy.get('#active-task-container').children().shadow().find('input[type=number]').should('contain.value', 2);
    });

    it('Set task description to 2 tasks', () => {
        cy.get('#create').click();
        cy.get('#active-task-container').find('task-component:nth-child(2)').shadow().find('input[type=text]').invoke("val", "task 1").trigger('input');
        cy.get('#active-task-container').find('task-component:nth-child(3)').shadow().find('input[type=text]').invoke("val", "task 2").trigger('input');
        cy.get('#active-task-container').find('task-component:nth-child(2)').shadow().find('input[type=text]').should('contain.value', 'task 1');
        cy.get('#active-task-container').find('task-component:nth-child(3)').shadow().find('input[type=text]').should('contain.value', 'task 2');
    });

    it('clicking dark mode should set background to black', () => {
        cy.get('body').should('have.css', 'background-color', 'rgb(255, 255, 255)');
        cy.get('#darkmode').find('slider-component').shadow().find('button').click();
        cy.get('body').should('have.css', 'background-color', 'rgb(26, 26, 26)')
    });


    it('Active and Break page should have display as none as Default', () => {
        cy.get('#active-page').should('have.css', 'display', 'none');
        cy.get('#break-page').should('have.css', 'display', 'none');
    });

    it('When tasks list is empty, clicking begin return prompt to enter a task and not redirect', () => {
        cy.get('#begin').click();
        cy.get('#active-page').should('have.css', 'display', 'none');
        cy.get('#break-page').should('have.css', 'display', 'none');
        cy.on('window:alert',(txt)=>{
            expect(txt).to.equal('Please add a task before beginning Pomo Session');
         })
    });

    it('When tasks are entered, clicking begin should redirect to active page', () => {
        cy.get('#create').click();
        cy.get('#active-task-container').find('task-component:nth-child(2)').shadow().find('input[type=text]').invoke("val", "task 1").trigger('input');
        cy.get('#active-task-container').find('task-component:nth-child(3)').shadow().find('input[type=text]').invoke("val", "task 2").trigger('input');
        cy.get('#active-task-container').find('task-component:nth-child(3)').shadow().find('input[type=number]').invoke("val", 2).trigger('change');

        cy.get('#active-task-container').find('task-component:nth-child(2)').shadow().find('input[type=text]').should('contain.value', 'task 1');
        cy.get('#active-task-container').find('task-component:nth-child(3)').shadow().find('input[type=text]').should('contain.value', 'task 2');
        cy.get('#active-task-container').find('task-component:nth-child(3)').shadow().find('input[type=number]').should('contain.value', 2);

        cy.get('#begin').click();
        cy.get('#setup').should('have.css', 'display', 'none');
        cy.get('#active-page').should('have.css', 'display', 'inline');
        cy.get('#break-page').should('have.css', 'display', 'none');
        cy.url().should('eq', 'http://127.0.0.1:5500/HTML/setup-active-break-pages.html#active-page');
    });

});

describe('active Tests', () => {
    beforeEach(() => {
        cy.clock(); //sets up clock for cypress
        cy.visit('http://127.0.0.1:5500/HTML/setup-active-break-pages.html'); 


        //this will enter active from setup with 2 tasks
        cy.get('#create').click();
        cy.get('#active-task-container').find('task-component:nth-child(2)').shadow().find('input[type=text]').invoke("val", "task 1").trigger('input');
        cy.get('#active-task-container').find('task-component:nth-child(3)').shadow().find('input[type=text]').invoke("val", "task 2").trigger('input');
        cy.get('#active-task-container').find('task-component:nth-child(3)').shadow().find('input[type=number]').invoke("val", 2).trigger('change');
        cy.get('#begin').click();
    });


    it('When in active page, clicking abort once should warn user about abort', () => {
        cy.get('#pomo-button').then($el =>{
            expect($el).to.have.prop('textContent','Abort');
        });
        cy.get('#pomo-button').click();
        cy.on('window:alert',(txt)=>{
            expect(txt).to.equal('Abort will end all pomo sessions, click again if you want to continue');
        })
    });

    it('When in active page, clicking abort twice should redirect to results page', () => {
        cy.get('#pomo-button').then($el =>{
            expect($el).to.have.prop('textContent','Abort');
        });
        cy.get('#pomo-button').click();
        cy.on('window:alert',(txt)=>{
            expect(txt).to.equal('Abort will end all pomo sessions, click again if you want to continue');
        })
        cy.on('uncaught:exception', () => {
            return false;
        })
        cy.get('#pomo-button').click();
        cy.url().should('eq', 'http://127.0.0.1:5500/HTML/results-page.html');
    });

    it('When in active page, after X mins, page should redirect to break page', () => {
        cy.tick(9000); //jumps clock to pass 9 secs
        cy.url().should('eq', 'http://127.0.0.1:5500/HTML/setup-active-break-pages.html#break-page');
    });
});

describe('break Tests', () => {
    beforeEach(() => {
        cy.clock(); //sets up clock for cypress
        cy.visit('http://127.0.0.1:5500/HTML/setup-active-break-pages.html'); 

        //this will enter active from setup with 2 tasks
        cy.get('#create').click();
        cy.get('#active-task-container').find('task-component:nth-child(2)').shadow().find('input[type=text]').invoke("val", "task 1").trigger('input');
        cy.get('#active-task-container').find('task-component:nth-child(3)').shadow().find('input[type=text]').invoke("val", "task 2").trigger('input');
        cy.get('#active-task-container').find('task-component:nth-child(3)').shadow().find('input[type=number]').invoke("val", 2).trigger('change');
        cy.get('#begin').click();
    });
    it('When in break page, clicking abort once should warn user about abort', () => {
        cy.tick(9000); //jumps clock by 9 secs, will enter break page
        cy.get('#break-button').then($el =>{
            expect($el).to.have.prop('textContent','Abort');
        });
        cy.get('#break-button').click();
        cy.on('window:alert',(txt)=>{
            expect(txt).to.equal('Abort will end all pomo sessions, click again if you want to continue');
        })
    });

    it('When in break page, clicking abort twice should redirect to results page', () => {
        cy.tick(9000); //jumps clock by 9 secs, will enter break page
        cy.get('#break-button').then($el =>{
            expect($el).to.have.prop('textContent','Abort');
        });
        cy.get('#break-button').click();
        cy.on('window:alert',(txt)=>{
            expect(txt).to.equal('Abort will end all pomo sessions, click again if you want to continue');
        })
        cy.on('uncaught:exception', () => {
            return false;
        })
        cy.get('#break-button').click();
        cy.url().should('eq', 'http://127.0.0.1:5500/HTML/results-page.html');
    });

    it('When in break page, after X mins, page should redirect to active page', () => {
        cy.tick(14000); //jumps clock by 14 secs, will enter break page and exit break page
        cy.url().should('eq', 'http://127.0.0.1:5500/HTML/setup-active-break-pages.html#active-page');
    });


    // WILL ADD MORE TESTS FOR TASK LIST
});