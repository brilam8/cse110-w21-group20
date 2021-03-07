if (!window.localStorage.getItem('slider-clicked')){
  window.localStorage.setItem('slider-clicked', JSON.stringify({}));
}

// component to create slider. Used for dark mode setting
class SliderComponent extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({mode: 'open'});
        const container = document.createElement('div');
        
        const button = container.appendChild(document.createElement('button'));
        button.setAttribute('class','setting-slider'); 
        button.id =  this.hasAttribute('button-id') ? this.getAttribute('button-id') : "default-id";

        const slider = button.appendChild(document.createElement('div'));
        slider.setAttribute('class', "slider-circle");
        slider.textContent = "Off";
    
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
            else if (button.id == "alert-button"){
              if (currentText == "On"){
                // document.getElementById('alert-sound').style.display = "inline";
                document.getElementById('alert-right-container').style.display = "inline";
              }
              else {
                // document.getElementById('alert-sound').style.display = "none";
                document.getElementById('alert-right-container').style.display = "none";
              }
            }
        };

        const style = document.createElement('style');
        style.textContent = `
        .setting-slider {
          width: 70px;
          height: 32px;
          border: none;
          border-radius: 25px;
          outline: none;
          margin-top: 0px;
          margin-right: 25px;
        }
        
        .slider-circle {
          width: 31px;
          height: 31px;
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
          transform: translate(30px);
        }
        `;

        //reclicks sliders on setting page to setting state stored in local storage
        let clickedList = JSON.parse(window.localStorage.getItem('slider-clicked'));
        if (clickedList[button.id] == "On"){
          button.classList.toggle("setting-slider-switch");
          slider.textContent = slider.textContent == "On" ? "Off" : "On";
          if (button.id == "alert-button") {
              // document.getElementById('alert-sound').style.display = "inline";
              document.getElementById('alert-right-container').style.display = "inline";
          }
        }
        this.shadowRoot.append(style, container);
    }

}

customElements.define('slider-component', SliderComponent);

document.getElementById("alert-frequency").addEventListener('change', ()=>{
  document.getElementById("alert-number").textContent = document.getElementById("alert-frequency").value;
});