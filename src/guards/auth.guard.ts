import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';
export const authGuard: CanActivateFn = (route, state) => {
 const _Router = inject(Router);
 const _authService = inject(AuthService);
if (_authService.isAuthenticated()) {
    const role = _authService.getUserRoleFromToken();
    if (role === 'Supplier' || role === 'Admin' ) {
      return true;
    }else {
      _Router.navigate(['/login']);
      Swal.fire({
                  toast: true,
                  position: 'top',
                  icon: 'warning',
                  title: 'You are not authorized to access this page',
                  showConfirmButton: false,
                  timer: 2500,
                });
      return false;
      
    }
} else {
  _Router.navigate(['/login']);
  Swal.fire({
    toast: true,
    position: 'top',
    icon: 'warning',
    title: 'You are not authorized to access this page',
    showConfirmButton: false,
    timer: 2500,
  });
  return false;
  
}
};
