import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageModeEnum } from 'src/app/core/infrastructure/enums';

@Component({
  template: '',
})
export class BaseComponent implements OnInit {
  pageMode: PageModeEnum;

  constructor(protected router: Router) {}

  ngOnInit() {
    console.log('BASE');

    this.setPageMode();
  }

  protected setPageMode(): void {
    const url = this.router.url;
    if (url.includes('edit')) {
      this.pageMode = PageModeEnum.edit;
    } else {
      this.pageMode = PageModeEnum.list;
    }
  }
}
