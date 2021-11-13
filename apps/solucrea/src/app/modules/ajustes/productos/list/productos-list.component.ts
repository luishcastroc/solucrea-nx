import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-list',
    templateUrl: './productos-list.component.html',
    styleUrls: ['./productos-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductosListComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
