import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Title, Meta } from '@angular/platform-browser';

@Component({
    selector: 'app-contact',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule
    ],
    templateUrl: './contact.html',
    styleUrl: './contact.scss'
})
export class ContactComponent {
    private readonly fb = inject(FormBuilder);
    private readonly snackBar = inject(MatSnackBar);
    private readonly titleService = inject(Title);
    private readonly metaService = inject(Meta);

    contactForm: FormGroup;
    submitted = signal(false);

    constructor() {
        this.titleService.setTitle('Contact Us | Pokedex');
        this.metaService.updateTag({ name: 'description', content: 'Get in touch with us for any inquiries about the Pokedex app.' });

        this.contactForm = this.fb.group({
            nombre: ['', [Validators.required, Validators.minLength(2)]],
            apellido: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{8,15}$/)]],
            consulta: ['', [Validators.required, Validators.minLength(10)]]
        });
    }

    onSubmit(): void {
        this.submitted.set(true);

        if (this.contactForm.valid) {
            const formData = this.contactForm.value;
            console.log('Formulario enviado:', formData);

            this.snackBar.open('¡Mensaje enviado con éxito! Te contactaremos pronto.', 'Cerrar', {
                duration: 5000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['success-snackbar']
            });

            this.contactForm.reset();
            this.submitted.set(false);
        } else {
            this.snackBar.open('Por favor completa todos los campos correctamente', 'Cerrar', {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['error-snackbar']
            });
        }
    }

    getErrorMessage(fieldName: string): string {
        const field = this.contactForm.get(fieldName);

        if (field?.hasError('required')) {
            return 'Este campo es requerido';
        }

        if (field?.hasError('email')) {
            return 'Email inválido';
        }

        if (field?.hasError('minlength')) {
            const minLength = field.errors?.['minlength'].requiredLength;
            return `Mínimo ${minLength} caracteres`;
        }

        if (field?.hasError('pattern')) {
            return 'Formato inválido (solo números, 8-15 dígitos)';
        }

        return '';
    }
}
