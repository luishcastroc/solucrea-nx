import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-frecuencias-detail',
  templateUrl: './frecuencias-detail.component.html',
  styleUrls: ['./frecuencias-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FrecuenciasDetailComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
