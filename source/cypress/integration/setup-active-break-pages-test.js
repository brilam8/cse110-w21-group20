let SetupActiveBreakURL = 'http://127.0.0.1:5500/HTML/setup-active-break-pages.html';
let HowToURL = 'http://127.0.0.1:5500/HTML/how-to-page.html';
let ResultsURL = 'http://127.0.0.1:5500/HTML/results-page.html';

describe('setup Tests', () => {
    beforeEach(() => {
        cy.visit(SetupActiveBreakURL); 
        cy.clock();
    });
    it("sample test", ()=>{
        expect(true).to.equal(true);
    });

    it('Clicking how-to-page button will redirect to how-to-page.html', () => {
        cy.get('#to-how-to-page').click();
        cy.url().should('eq', HowToURL);
    });
 
    it('Task list should be length 2', () => {
        cy.get('#active-task-container').children().should('have.length', 2);
    });

    it('Create should not create task if empty, task list should have length 2', () => {
        cy.get('#create').click();
        cy.get('#active-task-container').children().should('have.length', 2);
    });
  
    it('Set description and create task, description should be "task 1" and container length 3', () => {
        cy.get('#active-task-container').children().shadow().find('input[type=text]').type('task 1')
        cy.get('#create').click();
        cy.get('#active-task-container').children().should('have.length', 3);
        cy.get('#active-task-container').find('task-component:nth-child(2)').shadow().find('input[type=text]').should('contain.value', 'task 1');
    });

    it('Create task and delete task using button, task list should have length 2', () => {
        cy.get('#active-task-container').children().shadow().find('input[type=text]').type('inputTest')
        cy.get('#create').click();
        cy.get('#active-task-container').children().should('have.length', 3);
        cy.get('#active-task-container').find('task-component:nth-child(2)').shadow().find('button').click();
        cy.get('#active-task-container').children().should('have.length', 2);
    });

    it('Task should have default value of 1 pomo', () => {
        cy.get('#active-task-container').children().shadow().find('input[type=number]').should('contain.value', 1);
    });

    it('Clicking the up arrow should set task to have value of 2 pomos', () => {
        cy.get('#active-task-container').children().shadow().find('input[type=number]').invoke("val", 2).trigger('change');
        cy.get('#active-task-container').children().shadow().find('input[type=number]').should('contain.value', 2);
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
        cy.get('#active-task-container').children().shadow().find('input[type=text]').type('task 1')
        cy.get('#create').click();
        cy.get('#active-task-container').find('task-component:nth-child(3)').shadow().find('input[type=text]').type('task 2')
        cy.get('#active-task-container').find('task-component:nth-child(3)').shadow().find('input[type=number]').invoke("val", 2).trigger('change');

        cy.get('#active-task-container').find('task-component:nth-child(2)').shadow().find('input[type=text]').should('contain.value', 'task 1');
        cy.get('#active-task-container').find('task-component:nth-child(3)').shadow().find('input[type=text]').should('contain.value', 'task 2');
        cy.get('#active-task-container').find('task-component:nth-child(3)').shadow().find('input[type=number]').should('contain.value', 2);

        cy.get('#begin').click();
        cy.get('#setup').should('have.css', 'display', 'none');
        cy.get('#active-page').should('have.css', 'display', 'inline');
        cy.get('#break-page').should('have.css', 'display', 'none');
        cy.url().should('eq', SetupActiveBreakURL+'#active-page');
    });

    it("Clicking up arrow for Pomo Length should set pomo length to 30", ()=>{
        cy.get("#task-right-len").invoke("val", 30).trigger('change');
        cy.get("#task-right-len").should('contain.value', 30);

        cy.get('#active-task-container').find('task-component:nth-child(2)').shadow().find('input[type=text]').invoke("val", "task 1").trigger('input');
        cy.get('#begin').click();
        cy.url().should('eq', SetupActiveBreakURL+'#active-page');
        cy.get("#timer").then($el =>{
            expect($el).to.have.prop('textContent','30:00');
        });
    });

    it("Long Break occurs on every 4th Pomo", ()=>{
        cy.get('#active-task-container').find('task-component:nth-child(2)').shadow().find('input[type=text]').invoke("val", "task 1").trigger('input');
        cy.get('#active-task-container').find('task-component:nth-child(2)').shadow().find('input[type=number]').invoke("val", 5).trigger('input');
        cy.get('#begin').click();
        cy.url().should('eq', SetupActiveBreakURL+'#active-page');
        cy.tick(4*25*60*1000 + 3*5*60*1000 + 4*1000);
        cy.get("#pTitle").then($el =>{
            expect($el).to.have.prop('textContent','Long Break');
        });
        cy.get("#break-timer").then($el =>{
            expect($el).to.have.prop('textContent',"20:00");
        });
    });

    it("Clicking up arrow for Long Break on every 4th Pomo should set pomo to 5", ()=>{
        cy.get("#task-right-total").invoke("val", 5).trigger('change');
        cy.get("#task-right-total").should('contain.value', 5);
        cy.get("#long-break-indicator").then($el =>{
            expect($el).to.have.prop('textContent','5th');
        });

        cy.get('#active-task-container').find('task-component:nth-child(2)').shadow().find('input[type=text]').invoke("val", "task 1").trigger('input');
        cy.get('#active-task-container').find('task-component:nth-child(2)').shadow().find('input[type=number]').invoke("val", 5).trigger('input');
        cy.get('#begin').click();
        cy.url().should('eq', SetupActiveBreakURL+'#active-page');
        cy.tick(4*25*60*1000 + 3*5*60*1000 + 4*1000);
        cy.get("#pTitle").then($el =>{
            expect($el).to.have.prop('textContent','Short Break');
        });
        cy.get("#break-timer").then($el =>{
            expect($el).to.have.prop('textContent',"05:00");
        });


        cy.tick(1*25*60*1000 + 1*5*60*1000 + 1*1000);
        cy.get("#pTitle").then($el =>{
            expect($el).to.have.prop('textContent','Long Break');
        });
        cy.get("#break-timer").then($el =>{
            expect($el).to.have.prop('textContent',"20:00");
        });
    });

    it("Short Breaks Timer should be 5 mins", ()=>{
        cy.get('#active-task-container').find('task-component:nth-child(2)').shadow().find('input[type=text]').invoke("val", "task 1").trigger('input');
        cy.get('#active-task-container').find('task-component:nth-child(2)').shadow().find('input[type=number]').invoke("val", 5).trigger('input');
        cy.get('#begin').click();
        cy.url().should('eq', SetupActiveBreakURL+'#active-page');
        cy.tick(1*25*60*1000 + 1*1000);
        cy.get("#pTitle").then($el =>{
            expect($el).to.have.prop('textContent','Short Break');
        });
        cy.get("#break-timer").then($el =>{
            expect($el).to.have.prop('textContent',"05:00");
        });
    });

    it("Clicking up arrow for Short Breaks Timer should set minutes to 6", ()=>{
        cy.get("#task-right-break-btw").invoke("val", 6).trigger('change');
        cy.get("#task-right-break-btw").should('contain.value', 6);

        cy.get('#active-task-container').find('task-component:nth-child(2)').shadow().find('input[type=text]').invoke("val", "task 1").trigger('input');
        cy.get('#active-task-container').find('task-component:nth-child(2)').shadow().find('input[type=number]').invoke("val", 5).trigger('input');
        cy.get('#begin').click();
        cy.url().should('eq', SetupActiveBreakURL+'#active-page');
        cy.tick(1*25*60*1000 + 1*1000);
        cy.get("#pTitle").then($el =>{
            expect($el).to.have.prop('textContent','Short Break');
        });
        cy.get("#break-timer").then($el =>{
            expect($el).to.have.prop('textContent',"06:00");
        });
    });

    it("Long Break Timer should be 20 mins", ()=>{
        cy.get('#active-task-container').find('task-component:nth-child(2)').shadow().find('input[type=text]').invoke("val", "task 1").trigger('input');
        cy.get('#active-task-container').find('task-component:nth-child(2)').shadow().find('input[type=number]').invoke("val", 5).trigger('input');
        cy.get('#begin').click();
        cy.url().should('eq', SetupActiveBreakURL+'#active-page');
        cy.tick(4*25*60*1000 + 3*5*60*1000 + 4*1000);
        cy.get("#pTitle").then($el =>{
            expect($el).to.have.prop('textContent','Long Break');
        });
        cy.get("#break-timer").then($el =>{
            expect($el).to.have.prop('textContent',"20:00");
        });
    });

    it("Clicking up arrow for Short Breaks Timer should set minutes to 6", ()=>{
        cy.get("#task-right-long-break").invoke("val", 25).trigger('change');
        cy.get("#task-right-long-break").should('contain.value', 25);

        cy.get('#active-task-container').find('task-component:nth-child(2)').shadow().find('input[type=text]').invoke("val", "task 1").trigger('input');
        cy.get('#active-task-container').find('task-component:nth-child(2)').shadow().find('input[type=number]').invoke("val", 5).trigger('input');
        cy.get('#begin').click();
        cy.url().should('eq', SetupActiveBreakURL+'#active-page');
        cy.tick(4*25*60*1000 + 3*5*60*1000 + 4*1000);
        cy.get("#pTitle").then($el =>{
            expect($el).to.have.prop('textContent','Long Break');
        });
        cy.get("#break-timer").then($el =>{
            expect($el).to.have.prop('textContent',"25:00");
        });
    });

    it("Toggling Alert every 10 mins should show alert-frequency input element", ()=>{
        cy.get("#alert-right-container").should('have.css', 'display', 'none');

        cy.get("#alertcontainer").find('slider-component').shadow().find('button').click();
        cy.get("#alert-frequency").should('contain.value', 10);
        cy.get("#alert-right-container").should('have.css', 'display', 'block');
    });

    it("Setting alert-frequency input element to 15mins should change span within description", ()=>{
        cy.get("#alert-right-container").should('have.css', 'display', 'none');

        cy.get("#alertcontainer").find('slider-component').shadow().find('button').click();
        cy.get("#alert-frequency").should('contain.value', 10);
        cy.get("#alert-right-container").should('have.css', 'display', 'block');

        cy.get("#alert-frequency").invoke("val", 15).trigger('change');
        cy.get("#alert-number").then($el =>{
            expect($el).to.have.prop('textContent',"15");
        });
    });

    it('Clicking dark mode should set background to black', () => {
        cy.get('#darkmode').find('slider-component').shadow().find('button').click();
        cy.get('body').should('have.css', 'background-color', 'rgb(26, 26, 26)');
    });
});

describe('active Tests', () => {
    beforeEach(() => {
        cy.clock(); //sets up clock for cypress
        cy.visit(SetupActiveBreakURL); 


        //this will enter active from setup with 2 tasks
        cy.get('#active-task-container').find('task-component:nth-child(2)').shadow().find('input[type=text]').invoke("val", "task 1").trigger('input');
        cy.get('#create').click();
        cy.get('#active-task-container').find('task-component:nth-child(3)').shadow().find('input[type=text]').invoke("val", "task 2").trigger('input');
        cy.get('#active-task-container').find('task-component:nth-child(3)').shadow().find('input[type=number]').invoke("val", 2).trigger('change');
        cy.get('#begin').click();
    });


    it('When in active page, clicking abort should warn user about abort then clicking ok will redirect to results page', () => {
        cy.get('#pomo-button').then($el =>{
            expect($el).to.have.prop('textContent','Abort');
        });
        cy.get('#pomo-button').click();
        cy.on('window:confirm',(txt)=>{
            expect(txt).to.equal('Abort will end all pomo sessions, click ok if you want to continue');
        })
        cy.on('uncaught:exception', () => {
            return false;
        })
        cy.url().should('eq', ResultsURL);
    });


    it('When in active page, after X mins, page should redirect to break page', () => {
        cy.tick(1501000); //jumps clock to pass 25 mins
        cy.url().should('eq', SetupActiveBreakURL+'#break-page');
    });
});

describe('break Tests', () => {
    beforeEach(() => {
        cy.clock(); //sets up clock for cypress
        cy.visit(SetupActiveBreakURL); 

        //this will enter active from setup with 2 tasks
        cy.get('#active-task-container').find('task-component:nth-child(2)').shadow().find('input[type=text]').invoke("val", "task 1").trigger('input');
        cy.get('#create').click();
        cy.get('#active-task-container').find('task-component:nth-child(3)').shadow().find('input[type=text]').invoke("val", "task 2").trigger('input');
        cy.get('#active-task-container').find('task-component:nth-child(3)').shadow().find('input[type=number]').invoke("val", 2).trigger('input');
        cy.get('#create').click();
        cy.get('#active-task-container').find('task-component:nth-child(4)').shadow().find('input[type=text]').invoke("val", "task 3").trigger('input');
        cy.get('#active-task-container').find('task-component:nth-child(4)').shadow().find('input[type=number]').invoke("val", 3).trigger('input');
        cy.get('#begin').click();
    });
    it('When in break page, clicking abort  should warn user about abort then clicking ok should redirect to results page', () => {
        cy.tick(1501000); //jumps clock by 25 mins, will enter break page
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
        cy.url().should('eq', ResultsURL);
    });

    it('When in break page, after X mins, page should redirect to active page', () => {
        cy.tick(1801000); //jumps clock by 30mins, will enter break page and exit break page
        cy.url().should('eq', SetupActiveBreakURL+'#active-page');
    });

    it('Marking off a task in current task should move task to completed. It should also move one task from incompleted to current', ()=>{
        cy.tick(25*60*1000 + 1*1000);
        //current task has 'task 1'
        cy.get('#break-task-container').find('task-component:nth-child(2)').shadow().find('input[type=text]').should('contain.value', 'task 1');

        //incomplete task should have 'task 2' and 'task 3'
        cy.get('#incompleted-task-container').find('task-component:nth-child(2)').shadow().find('input[type=text]').should('contain.value', 'task 2');
        cy.get('#incompleted-task-container').find('task-component:nth-child(3)').shadow().find('input[type=text]').should('contain.value', 'task 3');
        cy.get('#incompleted-task-container').find('task-component:nth-child(2)').shadow().find('div').find('div').find('div').then(($el) =>{
            expect($el).to.have.prop('textContent','2 pomo');
        });
        cy.get('#incompleted-task-container').find('task-component:nth-child(3)').shadow().find('div').find('div').find('div').then(($el) =>{
            expect($el).to.have.prop('textContent','3 pomo');
        });
        cy.get('#incompleted-task-container').children().should('have.length', 3);

        //complete task is empty
        cy.get('#completed-task-container').children().should('have.length', 1);

        //check off 'task 1'
        cy.get('#break-task-container').find('task-component:nth-child(2)').shadow().find('input[type=checkbox]').click();
        cy.tick(30*60*1000 + 2*1000);

        //current task should have 'task 2'
        cy.get('#break-task-container').find('task-component:nth-child(2)').shadow().find('input[type=text]').should('contain.value', 'task 2');

        //incomplete task should have 'task 3'
        cy.get('#incompleted-task-container').find('task-component:nth-child(2)').shadow().find('input[type=text]').should('contain.value', 'task 3');
        cy.get('#incompleted-task-container').find('task-component:nth-child(2)').shadow().find('div').find('div').find('div').then(($el) =>{
            expect($el).to.have.prop('textContent','3 pomo');
        });
        cy.get('#incompleted-task-container').children().should('have.length', 2);

        //complete task should have 'task 1'
        cy.get('#completed-task-container').find('task-component:nth-child(2)').shadow().find('input[type=text]').should('contain.value', 'task 1');
        cy.get('#completed-task-container').find('task-component:nth-child(2)').shadow().find('div').find('div').find('div').then(($el) =>{
            expect($el).to.have.prop('textContent','1 pomo');
        });
        cy.get('#completed-task-container').children().should('have.length', 2);

    });

});


describe('Pomo-Setting Tests', () => {
    beforeEach(() => {
        cy.clock(); //sets up clock for cypress
        cy.visit('http://127.0.0.1:5500/HTML/setup-active-break-pages.html'); 
    });

    it('When set pomo-lenth to 20/25/30/35 minutes in pomo-setting, the corresponding timers in active page updated.', () => {
        let arr = [20,25,30,35]
        var loop = Array.from({length:4},(v,k)=>k+1)
        cy.wrap(loop).each((index)=>{
            cy.get('#create').click();
            cy.get('#active-task-container').find('task-component:nth-child(2)').shadow().find('input[type=text]').invoke("val", "task 1").trigger('input');
            cy.get('#task-right-len').invoke("val", arr[index-1]).trigger('input');
            cy.get('#begin').click();

            cy.get('#timer').then(($el) =>{
                expect($el).to.have.prop('innerHTML',arr[index-1]+":00");
            });
            cy.visit('http://127.0.0.1:5500/HTML/setup-active-break-pages.html'); 
           
        })
    });


    it('When set short-break timer to 5/6/7/8/9/10 minutes in pomo-setting, the corresponding timers in break page updated.', () => {
        let arr = [5,6,7,8,9,10]
        var loop = Array.from({length:6},(v,k)=>k+1)
        cy.wrap(loop).each((index)=>{
            cy.get('#create').click();
            cy.get('#active-task-container').find('task-component:nth-child(2)').shadow().find('input[type=text]').invoke("val", "task 1").trigger('input');
            cy.get('#task-right-break-btw').invoke("val", arr[index-1]).trigger('input');
            cy.get('#begin').click();
            cy.tick(1000*60*25);
            cy.tick(1000);
            cy.get('#break-timer').then(($el) =>{
                if(arr[index-1]==10){
                    expect($el).to.have.prop('innerHTML',arr[index-1]+":00");
                }else{
                    expect($el).to.have.prop('innerHTML',"0"+arr[index-1]+":00");
                }
            });

            cy.visit('http://127.0.0.1:5500/HTML/setup-active-break-pages.html'); 
           
        })
    });

    it('When set long-break timer to 15/20/25/30 minutes in pomo-setting, the corresponding timers in break page updated.', () => {
        let arr = [15,20,25,30]
        var loop = Array.from({length:4},(v,k)=>k+1)
        
        cy.wrap(loop).each((index)=>{
            let set = [2,3,4,5,6,7]
            for(let i=0;i<5;i++){
                cy.get('#create').click();
                cy.get('#active-task-container').find('task-component:nth-child('+set[i]+')').shadow().find('input[type=text]').invoke("val", "task "+set[i]).trigger('input');
            }
            cy.get('#task-right-long-break').invoke("val", arr[index-1]).trigger('input');
            cy.get('#begin').click();
            cy.tick(1000*60*(25*4+5*3));
            cy.tick(4000)
            cy.get('#break-timer').then(($el) =>{
                    expect($el).to.have.prop('innerHTML',arr[index-1]+":00");
                });
            cy.visit('http://127.0.0.1:5500/HTML/setup-active-break-pages.html'); 
           
        })
    });

    
    it('When set long break on every 4th/5th in pomo-setting, the break timer will function in each case.', () => {
        let arr = [4,5]
        var loop = Array.from({length:2},(v,k)=>k+1)
        
        cy.wrap(loop).each((index)=>{
           
            let set = [2,3,4,5,6,7]
            for(let i=0;i<5;i++){
                cy.get('#create').click();
                cy.get('#active-task-container').find('task-component:nth-child('+set[i]+')').shadow().find('input[type=text]').invoke("val", "task "+set[i]).trigger('input');
            }

            cy.get('#task-right-total').invoke("val", arr[index-1]).trigger('input');
            cy.get('#begin').click();

            cy.tick(1000*60*(25*arr[index-1]+5*(arr[index-1]-1)));
            cy.tick(1000*arr[index-1])

            cy.get('#break-timer').then(($el) =>{
                    expect($el).to.have.prop('innerHTML',"20:00");
                });

            cy.visit('http://127.0.0.1:5500/HTML/setup-active-break-pages.html'); 
           
        })
    });

    it('When check off one task from current task container, it goes to the completed task container', () => {
        
            let set = [2,3,4,5]
            for(let i=0;i<4;i++){
                cy.get('#create').click();
                cy.get('#active-task-container').find('task-component:nth-child('+set[i]+')').shadow().find('input[type=text]').invoke("val", "task "+set[i]).trigger('input');
            }
            cy.get('#begin').click();
            var loop = Array.from({length:3},(v,k)=>k+1)
            cy.wrap(loop).each((index)=>{
                cy.tick(1000*60*26)
                cy.tick(1000)
                cy.get('#break-task-container').find('task-component:nth-child(2)').shadow().find('input[type=checkbox]').click();
                cy.tick(1000*60*5)
                cy.get('#completed-task-container').find('task-component:nth-child('+set[index-1]+')').then($el =>{
                    console.log($el);
                    expect($el).to.have.attr('left-task',"task "+set[index-1]);
                 });
    })
    });
});
