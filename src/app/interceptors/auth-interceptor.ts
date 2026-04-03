import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AccountService } from '../services/account';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
   const accountService = inject(AccountService);

  const token = localStorage.getItem('token');

  let authReq = req;

  //Attach token
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError(err => {

      //If token expired
      if (err.status === 401) {

        const refreshToken = localStorage.getItem('refreshToken');

        if (!token || !refreshToken) {
          return throwError(() => err);
        }

        // Call refresh endpoint
        return accountService.postGenerateNewToken().pipe(
          switchMap((response: any) => {

            // Save tokens
            localStorage.setItem('token', response.token);
            localStorage.setItem('refreshToken', response.refreshToken);

            // Retry original request
            const newReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${response.token}`
              }
            });

            return next(newReq);
          }),
          catchError(refreshError => {
            // Refresh failed 
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');

            return throwError(() => refreshError);
          })
        );
      }

      return throwError(() => err);
    })
  );
};
