import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit {
  toasts: Toast[] = [];

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.toasts = this.toastService.getToasts();
  }

  removeToast(id: number) {
    this.toastService.remove(id);
  }

  // Fermer tous les toasts
  closeAllToasts() {
    this.toastService.clear();
  }

  // Getter pour accéder aux toasts depuis le template
  getToasts() {
    return this.toastService.getToasts();
  }
}