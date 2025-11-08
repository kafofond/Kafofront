import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AppSettings {
  theme: 'light' | 'dark';
  language: 'fr' | 'en';
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private settingsKey = 'app-settings';
  private defaultSettings: AppSettings = {
    theme: 'light',
    language: 'fr'
  };

  private settingsSubject = new BehaviorSubject<AppSettings>(this.getStoredSettings());
  public settings$ = this.settingsSubject.asObservable();

  constructor() {
    this.applyTheme(this.getStoredSettings().theme);
  }

  private getStoredSettings(): AppSettings {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem(this.settingsKey);
      return stored ? JSON.parse(stored) : this.defaultSettings;
    }
    return this.defaultSettings;
  }

  private saveSettings(settings: AppSettings): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.settingsKey, JSON.stringify(settings));
    }
    this.settingsSubject.next(settings);
    this.applyTheme(settings.theme);
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark-theme');
        document.documentElement.classList.remove('light-theme');
      } else {
        document.documentElement.classList.add('light-theme');
        document.documentElement.classList.remove('dark-theme');
      }
    }
  }

  setTheme(theme: 'light' | 'dark'): void {
    const currentSettings = this.getStoredSettings();
    const newSettings = { ...currentSettings, theme };
    this.saveSettings(newSettings);
  }

  setLanguage(language: 'fr' | 'en'): void {
    const currentSettings = this.getStoredSettings();
    const newSettings = { ...currentSettings, language };
    this.saveSettings(newSettings);
  }

  getCurrentSettings(): AppSettings {
    return this.getStoredSettings();
  }

  resetToDefault(): void {
    this.saveSettings(this.defaultSettings);
  }
}