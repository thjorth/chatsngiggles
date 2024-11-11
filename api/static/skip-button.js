const skipButtonTemplate = document.createElement("template");
skipButtonTemplate.innerHTML = `
<style>
.skip__button {
    all: unset;
    color: gray;
    opacity: 0.5;
    line-height: 24px;
    margin-block: 24px;
    margin-inline: 16px;

&:hover, &:focus {
    color: #04242D;
    cursor: pointer;
    text-decoration: underline;
}
}
</style>
    <div class="skip">
        <button data-skip-button class="skip__button" tabindex="0" style="xvisibility: hidden;">Skip assessment</button>
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
  }
}

customElements.define("skip-button", SkipButton);
