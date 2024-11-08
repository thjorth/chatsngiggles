
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

        this.clearContext();
        document.addEventListener('step:activate', (e) => {
            if (e.detail === this) {
                this.askInitialQuestion();
            }
        })
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
                    question: question,
                    context: this.getContextAsString(),
                }),
            }
        );
        const result = await response.json();
        this.storeContext(result.question, result.markdown);
        this._response.innerHTML += result.html;
    }

    askInitialQuestion() {
        this.ask('What do you suggest Crayon could help us with?')
    }

    clearContext() {
        if (localStorage.getItem('context')) {
            localStorage.removeItem('context');
        }
    }

    storeContext(question, answer) {
        const context = localStorage.getItem('context') ? JSON.parse(localStorage.getItem('context')) : [];
        context.push({
            user: question,
            assistant: answer
        });
        localStorage.setItem('context', JSON.stringify(context));
    }

    getContext() {
        if (localStorage.getItem('context')) {
            return JSON.parse(localStorage.getItem('context'));
        }
        return [];
    }

    getContextAsString() {
        const seeds = localStorage.getItem('seeds') ? JSON.parse(localStorage.getItem('seeds')) : [];
        let seed = '';
        if (seeds.length > 0) {
            seed = seeds.join(' ');
            seed += ' Please keep this in mind when aswering all questions. When replying, do not use emojis. Keep the answers to a few paragraphs. For the first question, please invite to ask more questions in the chat or contact sales.\n\n'
        }

        const context = this.getContext();
        console.log('context:', context);
        let contextFormattedArray = [];
        context.forEach(element => {
            contextFormattedArray.push(`user: ${element.user}\nassistant: ${element.assistant}\n\n\n`);
        });
        return seed + contextFormattedArray.join('\n******\n');
    }
}

customElements.define("chat-bot", ChatBot);