import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-list',
    templateUrl: './ajustes-creditos-list.component.html',
    styleUrls: ['./ajustes-creditos-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AjustesCreditosListComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
