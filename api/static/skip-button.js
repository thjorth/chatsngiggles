const skipButtonTemplate = document.createElement("template");
skipButtonTemplate.innerHTML = `
<style>

.skip__button {
    all: unset;
    color: gray;
    opacity: 0.5;
    line-height: 24px;
    margin-block-end: 56px;
    margin-inline: 16px;
    transition: all 0.2s ease-in-out;
}
  .skip__button:hover {
    color: #04242D;
    cursor: pointer;
    text-decoration: underline;
}
  .skip__button:focus {
    color: #04242D;
    cursor: pointer;
    text-decoration: underline;
}
  .skip__button:active {
    color: #04242D;
    cursor: pointer;
    text-decoration: underline;
}
.-hidden {
    display: none;
}
</style>
    <div class="skip">
        <button data-skip-button class="skip__button" tabindex="0">Skip assessment</button>
    </div>

`;

class SkipButton extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    this.root.appendChild(skipButtonTemplate.content.cloneNode(true));

    this.button = this.root.querySelector("[data-skip-button]");
    this.button.addEventListener("click", (e) => {
      e.preventDefault();
      const event = new Event("flow:skip-to-last");
      document.dispatchEvent(event);
    });
    document.addEventListener('chat:activated', () => {
        this.root.querySelector('[data-skip-button]').classList.add('-hidden');
    });
  }
}

customElements.define("skip-button", SkipButton);
