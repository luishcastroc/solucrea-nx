import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-details',
    templateUrl: './ajustes-creditos-details.component.html',
    styleUrls: ['./ajustes-creditos-details.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AjustesCreditosDetailsComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
