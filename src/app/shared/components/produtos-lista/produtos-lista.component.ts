import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe} from '@angular/common';
import { ChurrascometroService } from '../../services/churrascometro.service';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-produtos-lista',
  standalone: true,
  imports: [CommonModule, MatButtonModule, TitleCasePipe],
  templateUrl: './produtos-lista.component.html',
  styleUrl: './produtos-lista.component.scss',
})
export default class ProdutosListaComponent implements OnInit {
  @Input() produto!: string | any; // carnes ou bebidas

  getCarnes = this.churrascometroService.getCarnes;
  getBebidas = this.churrascometroService.getBebidas;

  items: any[] = [];

  constructor(
    private churrascometroService: ChurrascometroService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.produto === 'carnes') {
      this.churrascometroService.httpGetCarnes().subscribe({
        next: (carnes) => {
          this.items = carnes;
        },
      });
    } else {
      this.churrascometroService.httpGetBebidas().subscribe({
        next: (bebidas) => {
          this.items = bebidas;
        },
      });
    }
  }

  navegarParaCriacao() {
    this.router.navigate([`produtos/${this.produto}`]);
  }

  navegarParaEdicao(id: any) {
    this.router.navigate([`produtos/${this.produto}`, id]);
  }
}
