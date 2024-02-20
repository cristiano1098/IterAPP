import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Sets a header with the bear token if it exists in the local sotrage
 */
@Injectable()
export class BearerInterceptor implements HttpInterceptor {

  /**
   * @ignore
   */
  constructor() { }

  /**
   * Intercepts requests and sets a bear token in the request
   */
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    let backendRequest = request.url.startsWith('https://localhost:7072')
    let token = localStorage.getItem('token')

    if (backendRequest && token != null) {
      if (token) {
        request = request.clone({
          setHeaders: { 'Authorization': `Bearer ${token}` }
        })
      }
    }
    
    return next.handle(request);
  }
}
