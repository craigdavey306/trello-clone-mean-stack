import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

type InputType = 'input' | 'textarea';

@Component({
  selector: 'inline-form',
  templateUrl: './inlineForm.component.html',
})
export class InlineFormComponent {
  @Input() title = '';
  @Input() defaultText = 'Not defined';
  @Input() hasButton = false;
  @Input() buttonText = 'Submit';
  @Input() inputPlaceholder = '';
  @Input() inputType: InputType = 'input';

  @Output() handleSubmit = new EventEmitter<string>();

  isEditing = false;

  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      title: [''],
    });
  }

  activeEditing(): void {
    if (this.title) {
      this.form.patchValue({ title: this.title });
    }
    this.isEditing = true;
  }

  onSubmit(): void {
    if (this.form.value.title) {
      this.handleSubmit.emit(this.form.value.title);
    }

    this.isEditing = false;
    this.form.reset();
  }
}
