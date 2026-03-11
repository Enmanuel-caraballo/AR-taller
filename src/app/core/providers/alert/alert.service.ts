import { Injectable } from '@angular/core';
import Swal, { SweetAlertResult } from 'sweetalert2';

const PRIMARY = '#6B4E3D';
const CONFIRM_BTN = '#6B4E3D';
const CANCEL_BTN = '#e0d5ce';

@Injectable({ providedIn: 'root' })
export class AlertService {

  success(title: string, text?: string) {
    return Swal.fire({
      icon: 'success',
      title,
      text,
      confirmButtonColor: CONFIRM_BTN,
      confirmButtonText: 'Aceptar',
      customClass: { popup: 'ar-alert' },
    });
  }

  error(title: string, text?: string) {
    return Swal.fire({
      icon: 'error',
      title,
      text,
      confirmButtonColor: CONFIRM_BTN,
      confirmButtonText: 'Aceptar',
      customClass: { popup: 'ar-alert' },
    });
  }

  warning(title: string, text?: string) {
    return Swal.fire({
      icon: 'warning',
      title,
      text,
      confirmButtonColor: CONFIRM_BTN,
      confirmButtonText: 'Aceptar',
      customClass: { popup: 'ar-alert' },
    });
  }

  confirm(title: string, text?: string): Promise<SweetAlertResult> {
    return Swal.fire({
      icon: 'question',
      title,
      text,
      showCancelButton: true,
      confirmButtonColor: CONFIRM_BTN,
      cancelButtonColor: CANCEL_BTN,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'ar-alert',
        cancelButton: 'ar-cancel-btn',
      },
    });
  }

  toast(title: string, icon: 'success' | 'error' | 'warning' | 'info' = 'success') {
    return Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      customClass: { popup: 'ar-toast' },
    }).fire({ icon, title });
  }
}
