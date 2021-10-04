(function () {
  class HouseholdBuilder {
    constructor (entries = []) {
      this.entries = entries;

      this.$form = document.querySelector('form');
      this.$list = document.querySelector('.household');
      this.$debug = document.querySelector('.debug');

      this.$age = this.$form.querySelector('#age');
      this.$ageError = null;
      this.$rel = this.$form.querySelector('#rel');
      this.$relError = null;
      this.$smoker = this.$form.querySelector('#smoker');

      this.$addBtn = document.querySelector('.add');
      this.$submitBtn = document.querySelector('[type="submit"]');

      this.init();
    }

    // Initialize the form with a few DOM changes and event handlers
    init () {
      this.$ageError = document.createElement('p');
      this.$ageError.id = this.$age.ariaDescribedBy = 'age-error';
      this.$age.parentElement.parentElement.appendChild(this.$ageError);
      this.$age.required = true;

      this.$relError = document.createElement('p');
      this.$relError.id = this.$rel.ariaDescribedBy = 'relationship-error';
      this.$rel.parentElement.parentElement.appendChild(this.$relError);
      this.$rel.required = true;

      this.$addBtn.addEventListener('click', this.onAdd.bind(this));
      this.$submitBtn.addEventListener('click', this.onSubmit.bind(this));
    }

    onAdd (e) {
      e.preventDefault();
      const formData = {
        age: this.$age.value,
        relationship: this.$rel.value,
        smoker: this.$smoker.checked
      };

      if (this.validate(formData)) {
        this.addEntry(formData);
      }
    }

    addEntry (formData) {
      this.entries.push(formData);
      this.renderEntries();
      this.$form.reset();
      this.$age.focus();
    }

    onRemove (index) {
      this.entries.splice(index, 1);
      this.renderEntries();
    }

    // This is admittedly less efficient than adding/removing entries in place,
    // but it enables `this.entries` to be our single source of truth without having
    // to store any state (indices, etc.) in the DOM
    renderEntries () {
      this.$list.innerHTML = '';
      this.entries.forEach((entry, i) => {
        const newEntry = document.createElement('li');
        newEntry.textContent =
          `Age ${entry.age}, Relationship: ${entry.relationship}, Smoker: ${entry.smoker}`;
        const btn = document.createElement('button');
        btn.textContent = `Remove Entry ${i + 1}`;
        btn.addEventListener('click', this.onRemove.bind(this, i));
        newEntry.appendChild(btn);
        this.$list.appendChild(newEntry);
      });
    }

    validate (formData) {
      let ageError = null;
      let relError = null;

      if (formData.age === '') {
        ageError = 'Age is required';
      } else if (isNaN(formData.age)) {
        ageError = 'Age must be a number';
      } else if (formData.age <= 0) {
        ageError = 'Age must be greater than 0';
      }

      if (formData.relationship === '') {
        relError = 'Relationship is required';
      }

      this.$ageError.textContent = ageError;
      this.$relError.textContent = relError;

      // shift focus to first invalid element (WCAG 3.3.1)
      if (ageError) {
        this.$age.focus();
      } else if (relError) {
        this.$rel.focus();
      }

      return (ageError === null && relError === null);
    }

    onSubmit (e) {
      e.preventDefault();
      // stringify is slow/costly, but worth it here for readability
      this.$debug.innerHTML = JSON.stringify(this.entries);
      this.$debug.style.display = 'block';
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    new HouseholdBuilder();
  });
}());
