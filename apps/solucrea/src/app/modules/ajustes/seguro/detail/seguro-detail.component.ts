import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-seguro-detail',
    templateUrl: './seguro-detail.component.html',
    styleUrls: ['./seguro-detail.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeguroDetailComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
