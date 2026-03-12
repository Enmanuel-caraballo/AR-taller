import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController, PopoverController } from '@ionic/angular';
import { Auth } from 'src/app/core/providers/auth/auth';
import { Crud } from 'src/app/core/providers/crudFirebase/crud';
import { IUser } from 'src/app/interfaces/user.interface';
import { ModalComponent } from '../modal/modal.component';
import { ProfileModalComponent } from '../profile-modal/profile-modal.component';
import { ProfilePopoverComponent } from '../profile-popover/profile-popover.component';
import { IEvents } from 'src/app/interfaces/events.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false,
})
export class HeaderComponent implements OnInit {
  user: IUser | null = null;
  initials = '';

  isSearchOpen = false;
  searchQuery = '';
  searchResults: any[] = [];
  private allEvents: IEvents[] = [];

  constructor(
    private readonly authSrv: Auth,
    private readonly crudSrv: Crud,
    private readonly modalCtrl: ModalController,
    private readonly popoverCtrl: PopoverController,
    private readonly menuCtrl: MenuController
  ) {}

  async ngOnInit() {
    const currentUser = await this.authSrv.getCurrentUser();
    if (currentUser?.userUid) {
      const userData = await this.crudSrv.getByUid('users', currentUser.userUid);
      if (userData && userData.length > 0) {
        this.user = userData[0] as IUser;
        this.initials = this.buildInitials(this.user.name, this.user.lastName);
      }
    }
    const eventsData = await this.crudSrv.getAll('events');
    if (eventsData) this.allEvents = eventsData;
  }

  buildInitials(name: string, lastName: string): string {
    return (name?.charAt(0) || '').toUpperCase() + (lastName?.charAt(0) || '').toUpperCase();
  }

  // ── Popover del avatar (Ver perfil / Cerrar sesión) ───────────────────
  async openAvatarMenu(event: Event) {
    const popover = await this.popoverCtrl.create({
      component: ProfilePopoverComponent,
      componentProps: {
        initials: this.initials,
        userName: `${this.user?.name || ''} ${this.user?.lastName || ''}`.trim(),
        department: this.user?.department || '',
        photoURL: this.user?.photoURL || '',
      },
      event,
      cssClass: 'profile-popover',
      alignment: 'start',
    });
    await popover.present();

    const { data } = await popover.onWillDismiss();
    if (data?.action === 'profile') {
      this.openProfile();
    } else if (data?.action === 'logout') {
      this.authSrv.logOut();
    }
  }

  // ── Modal de perfil (ver / editar) ────────────────────────────────────
  async openProfile() {
    const modal = await this.modalCtrl.create({
      component: ProfileModalComponent,
      componentProps: { user: this.user },
      cssClass: 'profile-modal',
      breakpoints: [0, 0.75, 1],
      initialBreakpoint: 0.75,
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data?.updated && data?.user) {
      this.user = data.user;
      this.initials = this.buildInitials(this.user!.name, this.user!.lastName);
    }
  }

  // ── Menú hamburguesa ──────────────────────────────────────────────────
  async openMenu() {
    await this.menuCtrl.open('main-menu');
  }

  // ── Búsqueda ──────────────────────────────────────────────────────────
  toggleSearch() {
    this.isSearchOpen = !this.isSearchOpen;
    if (!this.isSearchOpen) {
      this.searchQuery = '';
      this.searchResults = [];
    }
  }

  onSearch(query: string) {
    this.searchQuery = query;
    if (!query.trim()) { this.searchResults = []; return; }
    const q = query.toLowerCase();
    this.searchResults = this.allEvents
      .filter(e =>
        e.title?.toLowerCase().includes(q) ||
        e.department?.toLowerCase().includes(q) ||
        e.responsible?.toLowerCase().includes(q) ||
        e.pdv?.toLowerCase().includes(q)
      )
      .slice(0, 6);
  }

  async selectEvent(event: any) {
    this.isSearchOpen = false;
    this.searchQuery = '';
    this.searchResults = [];
    const modal = await this.modalCtrl.create({
      component: ModalComponent,
      breakpoints: [0, 0.5, 0.75],
      initialBreakpoint: 0.5,
      handle: true,
      cssClass: 'custom-modal',
      componentProps: { events: [event] },
    });
    await modal.present();
  }
}
