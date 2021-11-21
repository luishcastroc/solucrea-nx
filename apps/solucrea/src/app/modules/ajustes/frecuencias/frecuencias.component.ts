import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-frecuencias',
  templateUrl: './frecuencias.component.html',
  styleUrls: ['./frecuencias.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FrecuenciasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
