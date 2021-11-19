import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-seguro',
    templateUrl: './seguro.component.html',
    styleUrls: ['./seguro.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeguroComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
