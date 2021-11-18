import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-modalidades-de-seguro-detail',
  templateUrl: './modalidades-de-seguro-detail.component.html',
  styleUrls: ['./modalidades-de-seguro-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalidadesDeSeguroDetailComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
