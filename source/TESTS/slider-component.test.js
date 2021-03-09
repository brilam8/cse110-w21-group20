customElements.define('slider-component', class extends HTMLElement {
    constructor(){
        super();

        if (!window.localStorage.getItem('slider-clicked')){
          window.localStorage.setItem('slider-clicked', JSON.stringify({}));
        }

        const container = document.createElement('div');
        container.setAttribute('class', 'general-settings-container');

        const containerName = container.appendChild(document.createElement('p'));
        containerName.setAttribute('class', "general-container-name");
        containerName.textContent = this.hasAttribute('name') ? this.getAttribute('name') : "Setting Undefined";
        
        const button = container.appendChild(document.createElement('button'));
        button.setAttribute('class','setting-slider');
        button.id =  this.hasAttribute('button-id') ? this.getAttribute('button-id') : "default-id";

        const slider = button.appendChild(document.createElement('div'));
        slider.setAttribute('class', "slider-circle");
        slider.textContent = "Off";
    
        this.name = containerName;
        this.button = button;

        button.onclick = ()=>{
            //moves the slider to on or off
            button.classList.toggle("setting-slider-switch");

            //stores settings state in local storage
            let clickedList = JSON.parse(window.localStorage.getItem('slider-clicked'));
            clickedList[button.id] = clickedList[button.id] == "On" ? "Off" : "On";
            window.localStorage.setItem("slider-clicked", JSON.stringify(clickedList));

            //sets slider text to on or off
            let currentText = slider.textContent = slider.textContent == "On" ? "Off" : "On";

            //sets background to black and text to white if darkmode is on.
            if (button.id === "dark-mode-button"){
                let color = currentText == "On" ? "#1a1a1a" : 'white';
                let otherColor = color == "white" ? "#1a1a1a" : 'white';
                window.localStorage.setItem('dark-mode', `${color}`);
                document.body.style.backgroundColor = color;
                document.body.style.color = otherColor;
            }
        };

        const style = document.createElement('style');
        style.textContent = `
          .general-settings-container {
            display: flex;
            margin-top: 20px;
            margin-left: 10px;
            align-items: center;
          }
          
          .general-container-name {
            width: 200px;
            height: 40px;
            margin: 0 5px;
            border: 4px solid rgb(242, 71, 38);;
            color: rgb(242, 71, 38);
            border-radius: 15px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          
          .setting-slider {
            width: 70px;
            height: 40px;
            border: none;
            border-radius: 25px;
            outline: none;
            
          }
          
          .slider-circle {
            width: 38px;
            height: 38px;
            border-radius: 50%;
            background-color: rgb(242, 71, 38);
            transform: translate(-3px);
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            transition: all 0.6s ease-out;
            cursor: pointer;

            color: white; //just added
          }
          
          .setting-slider-switch .slider-circle {
            transform: translate(23px);
          }
        `;

        //reclicks sliders on setting page to setting state stored in local storage
        let clickedList = JSON.parse(window.localStorage.getItem('slider-clicked'));
        if (clickedList[button.id] == "On"){
          button.classList.toggle("setting-slider-switch");
          slider.textContent = slider.textContent == "On" ? "Off" : "On";
        }
        
        this.append(style, container); 
    }
})


describe('dark mode component', () => {
  jest.spyOn(window.localStorage.__proto__, 'getItem');
  jest.spyOn(window.localStorage.__proto__, 'setItem');
  document.body.innerHTML = 
  `
  <slider-component id="dark-mode-button" button-id="dark-mode-button" name="Dark Mode">
  </slider-component>
  `;
  document.body.style.backgroundColor = "white";
  document.body.style.color = "#1a1a1a";

  test('creating dark mode slider component', () => {
      expect(document.body.innerHTML).toContain('Dark Mode');
      expect(document.body.innerHTML).toContain('Off');
      expect(document.getElementById('dark-mode-button').name.textContent).toEqual('Dark Mode'); 
      expect(window.localStorage.getItem).toHaveBeenCalled();
  })

  test('checking background and color before clicking', () => {
    expect(document.body.style.backgroundColor).toEqual("white");
    expect(document.body.style.color).toEqual("rgb(26, 26, 26)"); // rgb(26, 26, 26) === #1a1a1a
  })

  test('checking background and color after clicking', () => {
    document.getElementById('dark-mode-button').button.click();
    expect(window.localStorage.getItem).toHaveBeenCalled();
    expect(window.localStorage.setItem).toHaveBeenCalled();
    expect(document.body.innerHTML).toContain('On');
    expect(document.body.style.backgroundColor).toEqual("rgb(26, 26, 26)");
    expect(document.body.style.color).toEqual("white");
  })

});

test('creating undefined slider component', () => {
    document.body.innerHTML = `<slider-component></slider-component>`;
    expect(document.body.innerHTML).toContain('Setting Undefined'); 
})
