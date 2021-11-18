import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-modalidades-de-seguro-list',
  templateUrl: './modalidades-de-seguro-list.component.html',
  styleUrls: ['./modalidades-de-seguro-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalidadesDeSeguroListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
