import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-ocupaciones-detail',
  templateUrl: './ocupaciones-detail.component.html',
  styleUrls: ['./ocupaciones-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OcupacionesDetailComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
