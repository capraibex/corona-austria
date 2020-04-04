import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CORSInterceptor implements HttpInterceptor {
    private readonly corsURL = 'https://cors-anywhere.herokuapp.com/';

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        request = request.clone({
            url: `${this.corsURL}${request.url}`
        });
        return next.handle(request);
    }
}
