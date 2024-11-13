const template = document.createElement("template");
template.innerHTML = `
<style>
.input__form {

 @media (max-width: 420px) {
 align-items: baseline;

    }
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

 
&:hover, &:focus {
    opacity: 0.5;
    cursor: pointer;
}
}
.input__container {
    align-items: center;
    background: white;
    border: 1px solid #FF6A4C;
    border-radius: 24px;
    display: flex;
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
    <form class="input__form">
        <div class="container" data-response>
        </div>
        <div class="input__container">
        <input type="text" data-input class="chat__input" placeholder="What are you looking for?"></input>
        <button type="submit" class="chat__submit" style="xvisibility: hidden;"><img src="static/assets/submit.svg"/></button>
    </form>
`;

const userQuestionTemplate = document.createElement("template");
userQuestionTemplate.innerHTML = `
<style>
.chat__question {
  align-items: center;
  background-color: #FF6A4C;
  border: 1px solid #FF6A4C;
  border-radius: 32px 26px 0px 32px;
  display: flex;
  height: auto;
  justify-content: flex-end;
  margin-block: 24px;
  margin-inline-start: auto;
  max-width: 70vw;
  padding-block: 16px;
  padding-inline: 24px;
  color: white;
}

</style>
    <div class="chat__question">
        <div class="chat__question-content" data-chat-question>
            $q$
        </div>
    </div>
`;

const botAnswerTemplate = document.createElement("template");
botAnswerTemplate.innerHTML = `
<style>
.chat__answer{
  align-items: center;
  background-color: white;
  border: 1px solid white;
  border-radius: 26px 32px 32px 0px;
  display: flex;
  height: auto;
  justify-content: flex-start;
  margin-block: 24px;
  max-width: 70vw;
  padding-block: 16px;
  padding-inline: 24px;
}

</style>

    <div class="chat__answer">
        <div class="chat__answer-content" data-chat-answer>
            $a$
        </div>
    </div>
`;

const introTemplate = document.createElement("template");
introTemplate.innerHTML = `
<style>
.chat__intro__period {
  color: #FF6A4C;
}
</style>
    <div class="chat__intro">
        <div class="chat__intro-content" data-chat-answer>
            <h1>Hello and welcome<span class="chat__intro__period">.</span></h1>
            <p>
                How can I help you today?
            </p>
        </div>
    </div>
`;

class ChatBot extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    this.root.appendChild(template.content.cloneNode(true));
    this._form = this.root.querySelector("form");
    this._form.addEventListener("submit", (event) => this.submit(event));
    this._input = this._form.querySelector("[data-input]");
    this._response = this._form.querySelector("[data-response]");

    this.clearContext();
    document.addEventListener("step:activate", (e) => {
      if (e.detail === this) {
        this.askInitialQuestion();
        const event = new Event('chat:activated');
        document.dispatchEvent(event);
      }
    });
  }

  submit(event) {
    event.preventDefault();
    console.log("submit!", this._input.value);
    this.ask(this._input.value);
  }

  async ask(question, hideQuestion) {
    if (!hideQuestion) {
      this.appendQuestion(question);
    }
    const response = await fetch("/bot", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: question,
        context: this.getContextAsString(),
      }),
    });
    const result = await response.json();
    this.storeContext(result.question, result.markdown);
    this.appendAnswer(result.html);
  }

  appendQuestion(question) {
    const qElement = userQuestionTemplate.content.cloneNode(true);
    const qContainer = qElement.querySelector("[data-chat-question]");
    qContainer.innerHTML = qContainer.innerHTML.replace("$q$", question);
    this._response.appendChild(qElement);
  }

  appendAnswer(answer) {
    const aElement = botAnswerTemplate.content.cloneNode(true);
    const aContainer = aElement.querySelector("[data-chat-answer]");
    aContainer.innerHTML = aContainer.innerHTML.replace("$a$", answer);
    this._response.appendChild(aElement);
  }

  askInitialQuestion() {
    const seeds = localStorage.getItem("seeds")
      ? JSON.parse(localStorage.getItem("seeds"))
      : [];
    if (seeds.length > 0) {
      this.ask("What do you suggest Crayon could help us with?", true);
    } else {
      this._response.appendChild(introTemplate.content.cloneNode(true));
    }
  }

  clearContext() {
    if (localStorage.getItem("context")) {
      localStorage.removeItem("context");
    }
  }

  storeContext(question, answer) {
    const context = localStorage.getItem("context")
      ? JSON.parse(localStorage.getItem("context"))
      : [];
    context.push({
      user: question,
      assistant: answer,
    });
    localStorage.setItem("context", JSON.stringify(context));
  }

  getContext() {
    if (localStorage.getItem("context")) {
      return JSON.parse(localStorage.getItem("context"));
    }
    return [];
  }

  getContextAsString() {
    const seeds = localStorage.getItem("seeds")
      ? JSON.parse(localStorage.getItem("seeds"))
      : [];
    let seed = "";
    if (seeds.length > 0) {
      seed = seeds.join(" ");
      seed +=
        " Please keep this in mind when aswering all questions. When replying, do not use emojis. Keep the answers to a few paragraphs. For the first question, please invite to ask more questions in the chat or contact sales.\n\n";
    }

    const context = this.getContext();
    console.log("context:", context);
    let contextFormattedArray = [];
    context.forEach((element) => {
      contextFormattedArray.push(
        `user: ${element.user}\nassistant: ${element.assistant}\n\n\n`
      );
    });
    return seed + contextFormattedArray.join("\n******\n");
  }
}

customElements.define("chat-bot", ChatBot);
