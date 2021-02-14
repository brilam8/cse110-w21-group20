const settingsliders = [];
const timerbuttons = document.getElementsByClassName("timer-button");
const shortBeepNum = document.getElementById('short-beep-number');
const longBeepNum = document.getElementById('long-beep-number');

document.getElementById("to-landing-page").addEventListener('click', ()=> {
  // window.location.replace("./landing-page.html"); //better but only when landing page is finished
  window.location.href = "./landing-page.html";
});

for (const button of timerbuttons){
  button.addEventListener('click', ()=>{
    if (button.id == "short-beep-increment"){
      shortBeepNum.textContent = shortBeepNum.textContent != "5" ? parseInt(shortBeepNum.textContent) + 1 : shortBeepNum.textContent;
    }
    else if (button.id == "short-beep-decrement"){
      shortBeepNum.textContent = shortBeepNum.textContent != "1" ? parseInt(shortBeepNum.textContent) - 1 : shortBeepNum.textContent;
    }
    else if (button.id == "long-beep-increment"){
      longBeepNum.textContent = longBeepNum.textContent != "5" ? parseInt(longBeepNum.textContent) + 1 : longBeepNum.textContent;
    }
    else if (button.id == "long-beep-decrement"){
      longBeepNum.textContent = longBeepNum.textContent != "1" ? parseInt(longBeepNum.textContent) - 1 : longBeepNum.textContent;
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

}

customElements.define('gsetting-component', GeneralSettingComponent);


// for (const input of timerinputs){
//     input.addEventListener("keydown", (event)=>{
//         if (!parseInt(event.key) && event.key != "0" && event.key != "Backspace"){  
//             if (event.preventDefault) event.preventDefault();
//             event.returnValue = false;
//         }
//     });
// }