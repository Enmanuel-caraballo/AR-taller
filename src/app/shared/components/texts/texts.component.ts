import { Component, OnInit } from '@angular/core';
import { Crud } from 'src/app/core/providers/crudFirebase/crud';

@Component({
  selector: 'app-texts',
  templateUrl: './texts.component.html',
  styleUrls: ['./texts.component.scss'],
  standalone: false,
})
export class TextsComponent implements OnInit {
  events: any[] = [];
  isLoading = true;

  private readonly accentColors = [
    '#6B4E3D', '#5A6B4E', '#4E5A6B', '#6B5A4E', '#7C6B4E', '#4E6B6B',
  ];

  constructor(private readonly crudSrv: Crud) {}

  async ngOnInit() {
    try {
      const data = await this.crudSrv.getAll('events');
      if (data) {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        this.events = data
          .filter(e => new Date(e.start) >= now)
          .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
          .slice(0, 10);
      }
    } catch (err) {
      console.error('Error loading events:', err);
    } finally {
      this.isLoading = false;
    }
  }

  getAccentColor(index: number): string {
    return this.accentColors[index % this.accentColors.length];
  }

  getDayOfMonth(dateStr: string): string {
    return new Date(dateStr).getDate().toString().padStart(2, '0');
  }

  getMonthShort(dateStr: string): string {
    return new Date(dateStr)
      .toLocaleDateString('es-CO', { month: 'short' })
      .replace('.', '')
      .toUpperCase();
  }

  getDayLabel(dateStr: string): string {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const d = new Date(dateStr);
    const sameDay = (a: Date, b: Date) =>
      a.getDate() === b.getDate() &&
      a.getMonth() === b.getMonth() &&
      a.getFullYear() === b.getFullYear();
    if (sameDay(d, today)) return 'Hoy';
    if (sameDay(d, tomorrow)) return 'Mañana';
    return '';
  }

  readonly skeletons = [1, 2, 3];
}
