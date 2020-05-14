class App {
  constructor() {
    this.notes = []; /*an array of the stored notes*/

    // following are references to html elements, noted by $
    this.$form = document.querySelector('#form');
    this.$noteTitle = document.querySelector('#note-title');
    this.$formButtons = document.querySelector('#form-buttons');
    this.$noteText = document.querySelector('#note-text');
    this.$placeholder = document.querySelector('#placeholder');
    this.$notes = document.querySelector('#notes');
    this.addEventListeners(); /*Calls the addEventListener function when the app opens*/
  }

  addEventListeners() {
    document.body.addEventListener('click', event => { /*add click events to document body*/
      this.handleFormClick(event);
    });

    this.$form.addEventListener('submit', event =>{ /*add submit event to the form*/
      this.handleSubmit(event);
    })

  }

  handleFormClick(event) { /*Will open the form if the click event contains the form or close if outside */
    const isFormClicked = this.$form.contains(event.target);
    if (isFormClicked) {
      this.openForm();
    } else {
      this.closeForm();
    }
  }

  openForm() {
    this.$form.classList.add('form-open');
    this.$noteTitle.style.display = 'block';
    this.$formButtons.style.display = 'block';
  }

  closeForm() {
    this.$form.classList.remove('form-open');
    this.$noteTitle.style.display = 'none';
    this.$formButtons.style.display = 'none';
  }

  handleSubmit(event) { /*Will run if the submit event is called on the form.*/
    event.preventDefault(); /*Prevents the default submit function of refreshing the page*/
    const title = this.$noteTitle.value /*Stores the value of noteTitle and noteText in separate vars*/
    const text = this.$noteText.value
    const completeNote = title || text; /*Will check to see if the note has a title or text before adding*/
    if (completeNote) { /*If there is a note, will call the addNote func*/
      this.addNote({ title, text }); /*object shorthand to pass the title and text values to the addNote func*/
    }
  }

  addNote(note) {
    const newNote = { /*Creates a new object when called*/
      title: note.title,
      text: note.text,
      color: 'white',
      id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1
    };
    this.notes = [...this.notes, newNote]; /*Updates the notes array with all the previous notes and adds the newNote*/
    this.displayNotes(); /*Call the displayNotes function to display them on the page*/
    this.closeForm();
    this.clearForm();
  }

  displayNotes() {
    const hasNotes = this.notes.length > 0;
    this.$placeholder.style.display = hasNotes ? 'none' : 'flex';
    // Below, maps over the notes array, creating the HTML necessary to display each, and adds it to the notes element in the HTML file.
    this.$notes.innerHTML = this.notes.map(note => `
      <div style="background: ${note.color};" class="note">
          <div class="${note.title && 'note-title'}">${note.title}</div>
          <div class="note-text">${note.text}</div>
          <div class="toolbar-container">
            <div class="toolbar">
              <img class="toolbar-color" src="https://icon.now.sh/palette">
              <img class="toolbar-delete" src="https://icon.now.sh/delete">
            </div>
          </div>
        </div>
    `).join(""); /*Keeps the elements from being separated by a ' on the screen'*/
  }

  clearForm() {
    this.$noteTitle.value = '';
    this.$noteText.value = '';
  }
}
new App()
