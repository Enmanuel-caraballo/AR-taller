import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { BarcodeFormat } from '@zxing/library'

@Component({
  selector: 'app-sacanner-page',
  templateUrl: './sacanner-page.page.html',
  styleUrls: ['./sacanner-page.page.scss'],
  standalone: false
})
export class SacannerPagePage implements OnInit {

  availableDevice: MediaDeviceInfo[] = [];
  currentDevice: MediaDeviceInfo | undefined;
  hasDevice: boolean = false;

  qrResultString: string = '';

  allowedFormats = [
    BarcodeFormat.QR_CODE,
    BarcodeFormat.EAN_13,
    BarcodeFormat.EAN_8,
    BarcodeFormat.CODE_128,
    BarcodeFormat.UPC_A
  ];

  onCodeResult(resultString: string){
    this.qrResultString = resultString;
    if(this.qrResultString != '' && this.qrResultString != null){
      this.navSrv.navigateRoot('item-management', {
        state: {
          data: {
            code: this.qrResultString
          }
        }
      })
    }
    console.log('Contenido del QR: ', resultString);
  }

  onCameraFound(devices: MediaDeviceInfo[]):void {

    this.availableDevice = devices;
    this.hasDevice =  devices.length > 0;

    if(this.hasDevice){

      const backendCamera = devices.find(devices =>
        devices.label.toLowerCase().includes('back') ||
        devices.label.toLowerCase().includes('trasera')
      );

      this.currentDevice = backendCamera || devices[0];
    }
  }

  onDeviceSelectChange(event: any){
    const selectedDeviceId = event.detail.value;
    const device = this.availableDevice.find(d => d.deviceId === selectedDeviceId);
    this.currentDevice = device;
  }

  constructor(private readonly navSrv: NavController) { }

  ngOnInit() {
  }

}
