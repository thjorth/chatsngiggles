
const template = document.createElement('template');
template.innerHTML = `
    <form>
        <div class="chat__response-container">
            <div data-response class="chat__response">

            </div>
        </div>
        <input type="text" data-input class="chat__input" />
        <input type="submit" class="chat__submit" style="xvisibility: hidden;" />
    </form>
`;

class ChatBot extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });
        this.root.appendChild(template.content.cloneNode(true));
        this._form = this.root.querySelector('form');
        this._form.addEventListener('submit', (event) => this.submit(event));
        this._input = this._form.querySelector('[data-input]');
        this._response = this._form.querySelector('[data-response]');

        console.log(this._input, this._form);
    }

    submit(event) {
        event.preventDefault();
        console.log('submit!', this._input.value);
        this.ask(this._input.value);
    }

    async ask(question) {
        const response = await fetch(
            '/bot',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    question: question
                }),
            }
        );
        const result = await response.json();
        this._response.innerHTML += result.html;
    }
}

customElements.define("chat-bot", ChatBot);