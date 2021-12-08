import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-creditos-cliente-list',
    templateUrl: './creditos-cliente-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditosClienteListComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
