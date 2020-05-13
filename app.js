class App {
  constructor() {
    // following are references to html elements, noted by $
    this.$form = document.querySelector('#form');
    this.$noteTitle = document.querySelector('#note-title');
    this.$formButtons = document.querySelector('#form-buttons');
    this.$noteText = document.querySelector('#note-text');
    this.addEventListeners(); /*Calls the addEventListener function when the app opens*/
  }

  addEventListeners() {
    document.body.addEventListener('click', event => { /*add click events to document body*/
      this.handleFormClick(event);
    });

    this.$form.addEventListener('submit', event =>{
      this.handleSubmit(event);
    })

  }

  handleFormClick(event) { /*Will open the form if the click event contains the form or close if outside */
    const isFormClicked = this.$form.contains(event.target);
    if (isFormClicked) {
      this.openForm();
    } else {
      this.closeform();
    }
  }

  openForm() {
    this.$form.classList.add('form-open');
    this.$noteTitle.style.display = 'block';
    this.$formButtons.style.display = 'block';
  }

  closeform() {
    this.$form.classList.remove('form-open');
    this.$noteTitle.style.display = 'none';
    this.$formButtons.style.display = 'none';
  }

  handleSubmit(event) {
    event.preventDefault();
    const title = this.$noteTitle.value
    const text = this.$noteText.value
    const completeNote = title || text; /*Will check to see if the note has a title or text before adding*/
    if (completeNote) {
      addNote();
    }
  }

  addNote() {
    
  }
}
new App()
