import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  // Nombre que usa tu template (era 'form' en los errores)
  form!: FormGroup;

  // Mensajes que utiliza el template
  successMsg: string | null = null;
  errorMsg: string | null = null;

  // Año para el footer si lo usas en template
  currentYear: number = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatch });
  }

  // Valida que password y confirmPassword coincidan
  passwordMatch(group: FormGroup) {
    const p = group.get('password')?.value;
    const c = group.get('confirmPassword')?.value;
    return p === c ? null : { notMatch: true };
  }

  submit() {
    // Reset mensajes
    this.successMsg = null;
    this.errorMsg = null;

    if (this.form.invalid) {
      this.errorMsg = 'Por favor completa correctamente todos los campos.';
      return;
    }

    const payload = {
      name: this.form.value.name,
      email: this.form.value.email,
      password: this.form.value.password
    };

    // Comprueba que el servicio tenga register (evita errores si no existe)
    if (typeof (this.authService as any).register !== 'function') {
      // Modo fallback: mostramos mensaje de éxito local
      this.successMsg = 'Registro simulado: el backend no está disponible.';
      Swal.fire('Éxito (simulado)', this.successMsg || '', 'success');
      this.form.reset();
      return;
    }

    this.authService.register(payload).subscribe({
      next: (res) => {
        this.successMsg = 'Usuario registrado correctamente.';
        Swal.fire('Éxito', this.successMsg || '', 'success');
        this.form.reset();
      },
      error: (err) => {
        // Manejo básico de errores (puedes personalizar según tu backend)
        const msg = err?.error?.message || err?.message || 'Error al registrar usuario';
        this.errorMsg = msg;
        Swal.fire('Error', this.errorMsg || '', 'error');
      }
    });
  }
}
