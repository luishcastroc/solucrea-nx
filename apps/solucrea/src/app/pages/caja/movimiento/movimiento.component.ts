import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movimiento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movimiento.component.html',
  styleUrls: ['./movimiento.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovimientoComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
