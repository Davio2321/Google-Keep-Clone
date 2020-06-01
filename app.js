class App {
  constructor() {
    this.notes = []; /*an array of the stored notes*/
    this.title = '';
    this.text = '';
    this.id = '';


    // following are references to html elements, noted by $
    this.$form = document.querySelector('#form');
    this.$noteTitle = document.querySelector('#note-title');
    this.$formButtons = document.querySelector('#form-buttons');
    this.$noteText = document.querySelector('#note-text');
    this.$placeholder = document.querySelector('#placeholder');
    this.$notes = document.querySelector('#notes');
    this.$formCloseButton = document.querySelector('#form-close-button');
    this.$modal = document.querySelector('.modal');
    this.$modalTitle = document.querySelector('.modal-title')
    this.$modalText = document.querySelector('.modal-text')
    this.$modalCloseButton = document.querySelector('.modal-close-button');
    this.$colorToolTip = document.querySelector('#color-tooltip');

    this.addEventListeners(); /*Calls the addEventListener function when the app opens*/
  }

  addEventListeners() {
    document.body.addEventListener('click', event => { /*add click events to document body*/
      this.handleFormClick(event);
      this.handleFormClose(event);
      this.selectNote(event);
      this.openModal(event);
      this.deleteNote(event);
    });

    document.body.addEventListener('mouseover', event => {
      this.openToolTip(event);
    });

    document.body.addEventListener('mouseout', event => {
      this.closeToolTip(event);
    })

    this.$colorToolTip.addEventListener('mouseover', function() {
     this.style.display = 'flex';
   })

   this.$colorToolTip.addEventListener('mouseout', function() {
      this.style.display = 'none';
   })

   this.$colorToolTip.addEventListener('click', event => {
      const color = event.target.dataset.color;
      if (color) {
        this.editNoteColor(color);
      }
   })

    this.$form.addEventListener('submit', event =>{ /*add submit event to the form*/
      this.handleSubmit(event);
    });

    this.$modalCloseButton.addEventListener('click', event => {
      this.closeModal(event);
    });

  }

  handleFormClick(event) { /*Will open the form if the click event contains the form or close if outside */
    const isFormClicked = this.$form.contains(event.target);
    if (isFormClicked) {
      this.openForm();
    } else {
      this.closeForm();
    }
  }

  handleFormClose(event) {
    const isCloseClicked = this.$formCloseButton.contains(event.target);
    if (isCloseClicked) {
      this.closeForm();
      this.clearForm();
    }
  }

  selectNote(event) {
    const $selectedNote = event.target.closest('.note'); /*the closest() method starts at the current elem and travels up the DOM until it finds the provided selector string*/
    if(!$selectedNote) return;
    // children property returns an HTMLCollection, an array like list. Note: cannot map() or filter() over this. Then use array destructering to get the title and text element
    const [$noteTitle, $noteText] = $selectedNote.children;
    // Put these values into vars held in the constructor so the whole app can access them
    this.title = $noteTitle.innerText;
    this.text = $noteText.innerText;
    this.id = $selectedNote.dataset.id; /*dataset is a way to store single, read-only data on the html*/
  }

  openModal(event) {
    if (event.target.matches('.toolbar-delete')) return;  
    const isNoteClicked = event.target.closest('.note');
    if (isNoteClicked) {
      this.$modal.classList.toggle('open-modal');
      this.$modalTitle.value = this.title;
      this.$modalText.value = this.text;
    } else return;
  }

  closeModal(event) {
    this.editNote();
    this.$modal.classList.toggle('open-modal');
  }

  openToolTip(event) {
    if (!event.target.matches('.toolbar-color')) return;
    this.id = event.target.closest('.note').dataset.id;
    const noteCoords = event.target.getBoundingClientRect();
    const horizontal = noteCoords.left + window.scrollX;
    const vertical = noteCoords.top + window.scrollY;
    this.$colorToolTip.style.transform = `translate(${horizontal}px, ${vertical}px)`;
    this.$colorToolTip.style.display = 'flex';
  };

  closeToolTip(event) {
    if (!event.target.matches('.toolbar-color')) return;
    this.$colorToolTip.style.display = 'none';
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

  editNote() {
    const title = this.$modalTitle.value;
    const text = this.$modalText.value;
    this.notes = this.notes.map(note => {
      if (note.id === Number(this.id)) {
        note = { ...note, title, text }
      }
      return note;
    });
    this.displayNotes();
  }

  editNoteColor(color) {
    this.notes = this.notes.map(note => {
      if (note.id === Number(this.id)) {
        note = { ...note, color }
      }
      return note;
    });
    this.displayNotes();
  }

  deleteNote(event) {
    event.stopPropagation();
    if (!event.target.matches('.toolbar-delete')) return;
    const id = event.target.closest('.note').dataset.id;
    this.notes = this.notes.filter(note => note.id !== Number(id));
    this.displayNotes();
  }

  displayNotes() {
    const hasNotes = this.notes.length > 0;
    this.$placeholder.style.display = hasNotes ? 'none' : 'flex';
    // Below, maps over the notes array, creating the HTML necessary to display each, and adds it to the notes element in the HTML file.
    this.$notes.innerHTML = this.notes.map(note => `
      <div style="background: ${note.color};" class="note" data-id="${note.id}">
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
