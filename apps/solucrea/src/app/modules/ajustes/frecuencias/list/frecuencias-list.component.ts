import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-frecuencias-list',
  templateUrl: './frecuencias-list.component.html',
  styleUrls: ['./frecuencias-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FrecuenciasListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
