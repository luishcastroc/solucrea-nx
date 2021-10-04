import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-caja-detail',
  templateUrl: './caja-detail.component.html',
  styleUrls: ['./caja-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CajaDetailComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
