import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HttpService } from '../http.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private http: HttpService) {}

	/**
	 * Intercept HTTP responses to check for any errors; if 401 error, user is "logged out".  
	 * All other errors are re-thrown to not interfere with error handling
	 * @param request HttpRequest<any>
	 * @param next HttpHandler
	 */
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(request).pipe(catchError(err => {

			// do not apply this logic to requests from 'accounts' family (login, register, etc.)
			if (err.status === 401 && request.url.search('accounts') === -1) {
				// auto logout if 401 response returned from api
				this.http.logout();
				location.reload(true);
			}
			
			const error = err.error.message || err.statusText;
			return throwError(error);
		}));
	}

}