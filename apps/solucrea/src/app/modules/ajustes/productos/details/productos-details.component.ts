import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-details',
    templateUrl: './productos-details.component.html',
    styleUrls: ['./productos-details.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductosDetailsComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
