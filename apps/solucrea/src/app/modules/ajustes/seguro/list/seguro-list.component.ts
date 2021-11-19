import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-seguro-list',
    templateUrl: './seguro-list.component.html',
    styleUrls: ['./seguro-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeguroListComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
