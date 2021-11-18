import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-ocupaciones-list',
  templateUrl: './ocupaciones-list.component.html',
  styleUrls: ['./ocupaciones-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OcupacionesListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
