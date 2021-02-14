const timerinputs = document.getElementsByClassName("setting-input");
const settingsliders = [];
for (const input of timerinputs){
    input.addEventListener("keydown", (event)=>{
        if (!parseInt(event.key) && event.key != "0" && event.key != "Backspace"){  
            if (event.preventDefault) event.preventDefault();
            event.returnValue = false;
        }
    });
}

class GeneralSettingComponent extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({mode: 'open'});
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
        settingsliders.push(slider);

        this.name = containerName;
        this.button = button;
    
        button.onclick = ()=>{
            button.classList.toggle("setting-slider-switch");
            let currentText = slider.textContent = slider.textContent == "On" ? "Off" : "On";
            if (button.id === "dark-mode-button"){
                let color = currentText == "On" ? 'black' : 'white';
                let otherColor = color == "white" ? 'black' : 'white';
                window.localStorage.setItem('dark-mode', `${color}`);
                // for (const settingslider of settingsliders){
                //     settingslider.style.color = otherColor;
                // }
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
          }
          
          .general-container-name {
            width: 200px;
            height: 40px;
            margin: 0 5px;
            border: 4px solid;
            border-radius: 25px;
            text-align: center;
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
            background-color: rgb(255, 119, 45);
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
        this.shadowRoot.append(style, container);
    }

    // static get observedAttributes() {
    //     return [`name`, `button-id`];
    // }

    // attributeChangedCallback(name, oldValue, newValue){
    //     if (name == 'name'){
    //         this.name.textContent = newValue;
    //     }
    //     else if (name == 'button-id'){
    //         this.button.setAttribute('id', newValue);
    //     }
    // }
}

customElements.define('gsetting-component', GeneralSettingComponent);


// window.addEventListener('DOMContentLoaded', () => {
//     let darkmode = document.createElement('gsetting-component');
//     darkmode.setAttribute('name', 'Dark Mode');
//     darkmode.setAttribute('button-id', 'dark-mode-button');
//     generalsetting.appendChild(darkmode);

//     let autostart = document.createElement('gsetting-component');
//     autostart.setAttribute('name', 'Auto Start Next Pomo?');
//     autostart.setAttribute('button-id', 'auto-start-button');
//     generalsetting.appendChild(autostart);
// });
