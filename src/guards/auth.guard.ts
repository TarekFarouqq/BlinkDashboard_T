import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
 const _Router = inject(Router);
 const _authService = inject(AuthService);
 console.log("gemy 3abeet")
// navigate here to login in the blink website 
if (_authService.isAuthenticated()) {
    const role = _authService.getUserRoleFromToken();
    console.log(role)
    if (role === 'Supplier' || role === 'Admin' ) {
      
      return true;
    }else {
      _Router.navigate(['/login']);
      return false;
    }
} else {
  _Router.navigate(['/login']);
  return false;
}

};
