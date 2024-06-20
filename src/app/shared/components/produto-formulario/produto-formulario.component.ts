import { Component, Input, OnInit, effect } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChurrascometroService } from '../../services/churrascometro.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Carnes } from '../../models/carnes.interface';
import { Router } from '@angular/router';
import { IcamposForm } from './IcamposForm.interface';
import { TipoChurrasco } from '../../models/enums/tipoChurrasco.enum';
import { TipoBebidas } from '../../models/enums/tipoBebidas.enum';

import { MatSelectModule } from '@angular/material/select'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-produto-formulario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './produto-formulario.component.html',
  styleUrl: './produto-formulario.component.scss',
})
export class ProdutoFormularioComponent implements OnInit {
  @Input() idRoute!: string;
  @Input() produtoRoute: string = 'carnes';

  campos: IcamposForm[] = [];

  form!: FormGroup;

  listaTipoChurrasco: string[] = Object.values(TipoChurrasco);
  listaTipoBebida: string[] = Object.values(TipoBebidas);

  constructor(
    private formBuilder: FormBuilder,
    private servico: ChurrascometroService,
    private route: Router
  ) {
    effect(() => {
      if (this.servico.getProduto() && this.idRoute) {
        this.form.patchValue(this.servico.getProduto());
      }
    });

    this.campos = this.retornaCamposForm();
  }

  disableCrianca(): void {
    console.log(this.form.get('tipo')?.value);
    if (this.form.get('tipo')?.value === 'Alcóolica') {
      this.form.get('consumo_medio_crianca_ml')?.disable();
      this.form.get('consumo_medio_crianca_ml')?.setValue(0);
    } else {
      this.form.get('consumo_medio_crianca_ml')?.enable();
      this.form.get('consumo_medio_crianca_ml')?.setValue('');
    }
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({});

    this.campos = this.retornaCamposForm();

    switch (this.produtoRoute) {
      case 'carnes':
        this.campos;

        break;
      case 'bebidas':
        break;
    }

    this.campos.forEach((campo) => {
      this.addFormControl(campo.nome, [Validators.required]);
    });

    if (this.idRoute && this.produtoRoute) {
      console.log('ID', this.idRoute);
      this.servico.httpGetProduto(this.idRoute, this.produtoRoute).subscribe();
    }
  }

  private addFormControl(fieldName: string, validators: any[] = []): void {
    this.form.addControl(fieldName, this.formBuilder.control('', validators));
  }

  criar() {
    if (this.form.valid) {
      const produto = this.getProduto();

      if (produto) {
        console.log(produto);

        this.servico.httpCreateProduto(produto, this.produtoRoute).subscribe({
          next: (retorno) => {
            this.form.reset();
             Swal.fire({
               position: 'top-end',
               icon: 'success',
               title: ' Produto criado com sucesso!!!',
               showConfirmButton: false,
               timer: 2000,
             });
            console.log(retorno);
          },
             
          error: (error) => {
              Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Ocorreu um erro ao criar o produto!!!',
                showConfirmButton: false,
                timer: 2000,
              });
            
            console.error(error)
          }
          
          
        });
      }
    }
  }

  editar() {
    if (this.form.valid) {
      const produto = this.getProduto();
      // this.servico.httpUpdateNomeProduto(this.idRoute, nome, 'carnes')
      // .subscribe({
      //   next: (retorno) => {
      //     console.log('Editado', retorno);
      //     this.route.navigate(['/home']);
      //   }, error: (error) => console.error(error)
      // });
      if (produto) {
        this.servico
          .httpUpdateProduto(this.idRoute, this.produtoRoute, produto)
          .subscribe({
            next: (retorno: any) => {
              this.form.reset();
              console.log('Editado', retorno);
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: ' Produto salvo com sucesso!!!',
                showConfirmButton: false,
                timer: 2000,
              });
              this.route.navigate(['/produtos']);
            },
            error: (error) => {
              Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Ocorreu um erro ao salvar o produto!!!',
                showConfirmButton: false,
                timer: 2000,
              });

              console.error(error);
            },
          });
      }
    }
  }

  deletar() {
    if (this.idRoute) {
      this.servico
        .httpDeleteProduto(this.idRoute, this.produtoRoute)
        .subscribe({
          next: () => {
            console.log('Apagado');
            this.form.reset();

            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: ' Produto apagado com sucesso!!!',
              showConfirmButton: false,
              timer: 2000,
            });

            this.route.navigate(['/produtos']);
          },
          error: (error) => {
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: 'Ocorreu um erro ao deletar o produto!!!',
              showConfirmButton: false,
              timer: 2000,
            });

            console.error(error);
          },
        });
    }
  }

  private getProduto(): any {
    let produto!: any;

    // { nome: 'tipo', tipo: 'text', placeholder: 'Tipo' },
    this.campos.forEach((campo) => {
      const value = this.getValorFormControl(campo.nome); // Fruta

      if (value) {
        produto = {
          ...produto,
          [campo.nome]: campo.tipo === 'number' ? parseFloat(value) : value, // tipo: Fruta
        };
      }
    });

    return produto;
  }

  private getValorFormControl(nome: string): string | null {
    return this.form.get(nome)?.value;
  }

  private retornaCamposForm() {
    let campos: IcamposForm[] = [];

    console.log('produto da rota ', this.produtoRoute);

    if (this.produtoRoute === 'carnes') {
      campos = [
        { nome: 'nome', tipo: 'text', placeholder: 'Nome' },
        { nome: 'tipo', tipo: 'list', placeholder: 'Tipo' },
        { nome: 'preco_kg', tipo: 'number', placeholder: 'Preço por kg' },
        {
          nome: 'consumo_medio_adulto_g',
          tipo: 'number',
          placeholder: 'Consumo médio por adulto (g)',
        },
        {
          nome: 'consumo_medio_crianca_g',
          tipo: 'number',
          placeholder: 'Consumo médio por criança (g)',
        },
      ];
    } else if (this.produtoRoute === 'bebidas') {
      campos = [
        { nome: 'nome', tipo: 'text', placeholder: 'Nome' },
        { nome: 'tipo', tipo: 'list', placeholder: 'Tipo' },
        {
          nome: 'preco_unidade',
          tipo: 'number',
          placeholder: 'Preço por unidade',
        },
        {
          nome: 'consumo_medio_adulto_ml',
          tipo: 'number',
          placeholder: 'Consumo médio por adulto (ml)',
        },

        {
          nome: 'consumo_medio_crianca_ml',
          tipo: 'number',
          placeholder: 'Consumo médio por criança (ml)',
        },
      ];
    }

    return campos;
  }

  private emiteMensagem(tipo: string = 'success', mensagem: string): void {
    

  }
}
