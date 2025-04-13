import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const _Router = inject(Router);
 const _authService = inject(AuthService);
if (_authService.isAuthenticated()) {
    const role = _authService.getUserRoleFromToken();
    if ( role === 'Admin' ) {
      return true;
    }else {
      return false;
      
    }
} else {
  return false;
}
};
