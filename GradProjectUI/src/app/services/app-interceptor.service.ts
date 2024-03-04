import { Injectable } from '@angular/core';
import {
  HttpResponse,
  HttpEvent,
  HttpErrorResponse,
  HttpRequest,
  HttpHandler, HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import {environment} from "../../environment";

@Injectable({
  providedIn: 'root',
})
export class AppHttpInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let headers = req.headers;

    // Check if the request body is not an instance of FormData
    if (!(req.body instanceof FormData)) {
        // If not, append 'Content-Type' header with the value 'application/json'
      headers = headers.append('Content-Type', 'application/json');
    }

    // Append 'Accept' and 'Cache-control' headers
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Cache-control', 'no-cache');
   
    // Get the original request URL
    var url = req.url;

      url = environment.ServiceUrl + url;

    // Check if there's a JWT token in local storage
    if (localStorage.getItem('jwt')) {
      
      // If yes, append 'Authorization' header with the JWT token
      headers = headers.append(
        'Authorization',
        'Bearer ' + localStorage.getItem('jwt')
      );
    }
   
    const options = { headers: headers, url: url };
    const authReq = req.clone(options);

    return next.handle(authReq).pipe(
      catchError((err: any, caught: Observable<any>) => {
        debugger
        if (err instanceof HttpErrorResponse) {
          //  if (err.status === 401 || err.status === 403) {
          //    this.router.navigate(['/login']);
          //   return throwError({});
          // }
          this.router.navigate(['/login']);
          return throwError(err.error);
        }
        // TODO: Check what we need to return
        return throwError({});
      }),

      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          event = event.clone({ body: event.body });
          var token = event.headers.get('token'); //Retrieves a token from the response headers
          if (token) {
            localStorage.removeItem('jwt');
            localStorage.setItem('jwt', token);
          }
          return event;
        }
        return event; // Return the event as is, assuming it's of type HttpEvent<any>
      })
    );
  }
}
