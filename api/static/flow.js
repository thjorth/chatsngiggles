const flowTemplate = document.createElement('template');
flowTemplate.innerHTML = `
    <div class="flow">
        <slot></slot>
    </div>
`;
class Flow extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });
        this.root.appendChild(flowTemplate.content.cloneNode(true));
        this.steps = [];
        this.numberOfSteps = 0;
        this.currentStep = 0;
    }

    connectedCallback() {
        setTimeout(() => {
            this.steps = [...this.children];
            this.numberOfSteps = this.steps.length;
            this.updateFlowState();
        }, 100);

        // attach an event listener, that allows the user to progress through the flow
        document.addEventListener('flow:next', () => {
            console.log('on next:')
            if (this.currentStep < this.numberOfSteps - 1) {
                this.currentStep++;
                this.updateFlowState();
            }
        });
    }

    updateFlowState() {
        this.steps.forEach((step, index) => {
            if (index != this.currentStep) {
                step.classList.add('flow__hidden');
            }
            else {
                step.classList.remove('flow__hidden');
            }
        });
        const activeElement = this.steps[this.currentStep];
        const event = new CustomEvent('step:activate', { detail: activeElement });
        document.dispatchEvent(event);
    }
}

customElements.define('flow-component', Flow);   