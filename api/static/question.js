const questionTemplate = document.createElement("template");
questionTemplate.innerHTML = `
<style>
.data__answers >button {
  background-color: white;
  border: 1px solid #E6E4D9;
  border-radius: 16px;
  min-height: 69px;
  margin-block: 8px;
  width: 100%;
  font-size: 14px;
  font-family: var(--font-family);
  text-align: left;
  padding: 8px 16px;
  color: var(--darkforestgreen);
  line-height: 1.3;
  transition: all 0.2s ease-in-out;
}
.data__answers >button:hover {
  border: 1px solid #FF6A4C;
}
.data__answers >button:focus {
  border: 1px solid #FF6A4C;
}
  .data__answers >button:active {
  border: 1px solid #FF6A4C;
}
  .data__answers strong {
    font-size: 16px;
    line-height: 2;
  }
    </style>
    <div class="question">
        <form>
            <h2 data-question></h2>
            <div class="data__answers" data-answers></div>
        </form>
    </div>
      
`;

class Question extends HTMLElement {
    static get observedAttributes() {
        return ["question"];
    }

    constructor() {
        super();
        this.root = this.attachShadow({ mode: "open" });
        this.root.appendChild(questionTemplate.content.cloneNode(true));
        this.model = {};
        this.uiHasBeenBuilt = false;
        this.initLocalStorage();
    }

    connectedCallback() { }

    initLocalStorage() {
        if (localStorage.getItem("seeds")) {
            localStorage.removeItem("seeds");
        }
        localStorage.setItem("seeds", JSON.stringify([]));
    }

    attributeChangedCallback(property, oldValue, newValue) {
        if (this.uiHasBeenBuilt) {
            return;
        }
        switch (property) {
            case "question":
                try {
                    this.model = JSON.parse(newValue);
                } catch (ex) {
                    console.log(ex);
                }
                break;
        }
        this.buildUi();
        console.log("this.model", this.model);
    }

    buildUi() {
        this.root.querySelector("[data-question]").innerHTML = this.model.question;
        console.log(this.model);
        this.model.answers.forEach((answer) => {
            const button = document.createElement("button");

            button.innerHTML = `<strong>${answer.text}</strong><br/>${answer.description}`;
            button.value = answer.value;
            button.addEventListener("click", (e) => {
                e.preventDefault();
                this.recordAnswer(e.target.value);
                this.proceed();
            });
            this.root.querySelector("[data-answers]").appendChild(button);
        });
        this.uiHasBeenBuilt = true;
    }

    recordAnswer(answer) {
        const seeds = JSON.parse(localStorage.getItem("seeds"));
        seeds.push(answer);
        localStorage.setItem("seeds", JSON.stringify(seeds));
    }

    proceed(e) {
        if (e) {
            e.preventDefault();
        }
        const event = new Event("flow:next");
        document.dispatchEvent(event);
    }
}

customElements.define("question-component", Question);
