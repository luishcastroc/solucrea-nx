import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-caja-list',
  templateUrl: './caja-list.component.html',
  styleUrls: ['./caja-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CajaListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
