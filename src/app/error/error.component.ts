import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent {
  @Input() error: HttpErrorResponse = new HttpErrorResponse({status: 404, error: {error: 'Page not be found.'}});

}
