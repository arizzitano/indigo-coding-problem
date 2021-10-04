(function () {
  function HouseholdBuilder () {
    this.entries = [];

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
  HouseholdBuilder.prototype.init = function () {
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
  };

  HouseholdBuilder.prototype.onAdd = function (e) {
    e.preventDefault();
    var formData = {
      age: this.$age.value,
      relationship: this.$rel.value,
      smoker: this.$smoker.value === 'on'
    };

    if (this.validate(formData)) {
      this.addEntry(formData);
    } else {
      // shift focus above the form
    }
  };

  HouseholdBuilder.prototype.addEntry = function (formData) {
    this.entries.push(formData);
    this.renderEntries();
    this.$form.reset();
    this.$age.focus();
  };

  HouseholdBuilder.prototype.onRemove = function (index) {
    this.entries.splice(index, 1);
    this.renderEntries();
  };

  // This is admittedly less efficient than adding/removing entries in place,
  // but it enables `this.entries` to be our single source of truth without having
  // to store any state (indices, etc.) in the DOM
  HouseholdBuilder.prototype.renderEntries = function () {
    this.$list.innerHTML = '';
    for (var i = 0; i < this.entries.length; i++) {
      var entry = this.entries[i];
      var newEntry = document.createElement('li');
      newEntry.textContent =  'Age ' + entry.age +
                              ', Relationship: ' + entry.relationship +
                              ', Smoker: ' + entry.smoker;
      var btn = document.createElement('button');
      btn.textContent = 'Remove Entry ' + (i + 1);
      btn.addEventListener('click', this.onRemove.bind(this, i));
      newEntry.appendChild(btn);
      this.$list.appendChild(newEntry);
    }
  };

  HouseholdBuilder.prototype.renderErrors = function (formData) {
    var ageError = null;
    var relError = null;

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

    return (ageError === null && relError === null);
  };

  HouseholdBuilder.prototype.onSubmit = function (e) {
    e.preventDefault();
    // stringify is slow/costly, but worth it here for readability
    this.$debug.innerHTML = JSON.stringify(this.entries);
    this.$debug.style.display = 'block';
  };

  document.addEventListener('DOMContentLoaded', function () {
    var h = new HouseholdBuilder();
  });
}());
