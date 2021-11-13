import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-productos',
    templateUrl: './productos.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductosComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
