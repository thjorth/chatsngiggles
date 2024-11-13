const chatInputTemplate = document.createElement('template');
chatInputTemplate.innerHTML = `
    <style>
        input:focus::placeholder {
            color: transparent;
        }
        .-hide {
            display: none!important;
        }
        .chat__submit {
            all: unset;
            background: #FF6A4C;
            border: 1px solid #FF6A4C;
            border-radius: 50%;
            display: flex;
            height: 32px;
            justify-items: center;
            width: 32px;
            position: absolute;
            right: 10px;
        }
        .input__container {
            align-items: center;
            background: white;
            border: 1px solid #FF6A4C;
            border-radius: 24px;
            display: flex;
            position: relative;
            margin-botton: 10px;
        }
        .chat__input {
            border: none;
            height: 48px;
            min-width:290px;
            max-width:358px;
            margin-inline-start: 20px;
            font-size: 16px;
            font-family: Sofia Pro Regular;
            outline: none;
        }
    </style>
    <form class="input__container -hide">
        <input type="text" data-input class="chat__input" placeholder="What are you looking for?"></input>
        <button type="submit" class="chat__submit" style="xvisibility: hidden;"><img src="static/assets/submit.svg"/></button>
    </form>
`;

class ChatInput extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: "open" });
        this.root.appendChild(chatInputTemplate.content.cloneNode(true));
        this.form = this.root.querySelector('form');
        this.form.addEventListener('submit', (e) => { this.onSubmit(e); })
        this.input = this.root.querySelector('[data-input]');

        document.addEventListener('chat:activated', () => { this.show(); })
    }

    onSubmit(e) {
        if (e) {
            e.preventDefault();
        }
        const event = new CustomEvent('chat:ask', { detail: this.input.value });
        document.dispatchEvent(event);
        this.input.value = '';
    }

    show() {
        this.form.classList.remove('-hide');
    }
}

customElements.define('chat-input', ChatInput);
