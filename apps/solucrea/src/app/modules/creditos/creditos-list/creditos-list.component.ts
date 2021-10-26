import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-creditos-list',
    templateUrl: './creditos-list.component.html',
    styleUrls: ['./creditos-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditosListComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
