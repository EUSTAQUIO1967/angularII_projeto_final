import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { PrecoFormularioComponent } from '../../shared/components/preco-formulario/preco-formulario.component';
import { RouterLink } from '@angular/router';
import { LoginService } from '../../shared/services/login.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, PrecoFormularioComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export default class HomeComponent {
  welcomeMessage: string = 'Bem-vindo ao Churrascômetro!'

  // #scrollService = inject(ScrollService);

  loginService = inject(LoginService);

  constructor() { 
    
  }
}
