const skipButtonTemplate = document.createElement('template');
skipButtonTemplate.innerHTML = `
    <div class="skip">
        <button data-skip-button class="skip__button">Skip assessment</button>
    </div>
`;

class SkipButton extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });
        this.root.appendChild(skipButtonTemplate.content.cloneNode(true));

        this.button = this.root.querySelector('[data-skip-button]');
        this.button.addEventListener('click', (e) => {
            e.preventDefault();
            const event = new Event('flow:skip-to-last');
            document.dispatchEvent(event);
        });
    }
}

customElements.define("skip-button", SkipButton);