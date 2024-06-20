import { Component } from '@angular/core';
import ProdutosListaComponent from '../../../shared/components/produtos-lista/produtos-lista.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule, ProdutosListaComponent],
  templateUrl: './produtos.component.html',
  styleUrl: './produtos.component.scss',
})
export class ProdutosComponent {

}
