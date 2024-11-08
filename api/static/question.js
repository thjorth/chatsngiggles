
const questionTemplate = document.createElement('template');
questionTemplate.innerHTML = `
    <div class="question">
        <form>
            <h2 data-question></h2>
            <div data-answers>

            </div>
            <button>Click to go to next step</button>
        </form>
    </div>
`;
class Question extends HTMLElement {
    static get observedAttributes() {
        return ['question'];
    }

    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });
        this.root.appendChild(questionTemplate.content.cloneNode(true));
        this.button = this.root.querySelector('button');
        this.button.addEventListener('click', this.proceed);
        this.model = {};
        this.uiHasBeenBuilt = false;
        this.initLocalStorage();
    }

    connectedCallback() {
    }

    initLocalStorage() {
        if (localStorage.getItem('seeds')) {
            localStorage.removeItem('seeds');
        }
        localStorage.setItem('seeds', JSON.stringify([]));
    }

    attributeChangedCallback(property, oldValue, newValue) {
        if (this.uiHasBeenBuilt) {
            return;
        }
        switch (property) {
            case "question":
                try {
                    this.model = JSON.parse(newValue);

                }
                catch (ex) {
                    console.log(ex);
                }
                break;
        }
        this.buildUi();
        console.log('this.model', this.model);
    }

    buildUi() {
        this.root.querySelector('[data-question]').innerHTML = this.model.question;
        console.log(this.model)
        this.model.answers.forEach(answer => {
            const button = document.createElement('button');
            button.textContent = answer.text;
            button.value = answer.value;
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.recordAnswer(e.target.value);
                this.proceed();
            });
            this.root.querySelector('[data-answers]').appendChild(button);
        });
        this.uiHasBeenBuilt = true;
    }

    recordAnswer(answer) {
        const seeds = JSON.parse(localStorage.getItem('seeds'));
        seeds.push(answer);
        localStorage.setItem('seeds', JSON.stringify(seeds));
    }

    proceed(e) {
        if (e) {
            e.preventDefault();
        }
        const event = new Event('flow:next');
        document.dispatchEvent(event);
    }
}

customElements.define('question-component', Question);   