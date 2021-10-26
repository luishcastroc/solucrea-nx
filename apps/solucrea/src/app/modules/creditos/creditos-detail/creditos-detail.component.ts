import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-creditos-detail',
    templateUrl: './creditos-detail.component.html',
    styleUrls: ['./creditos-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditosDetailComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
