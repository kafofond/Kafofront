import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AppSettings, SettingsService } from '../../services/settings.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-parametres',
  imports: [CommonModule, FormsModule],
  templateUrl: './parametres.html',
  styleUrl: './parametres.css'
})
export class Parametres implements OnInit, OnDestroy {
  currentSettings: AppSettings = { theme: 'light', language: 'fr' };
  translations: any = {};
  private settingsSubscription!: Subscription;

  constructor(
    private settingsService: SettingsService,
    private translationService: TranslationService
  ) {}

  ngOnInit() {
    this.currentSettings = this.settingsService.getCurrentSettings();
    
    this.settingsSubscription = this.settingsService.settings$.subscribe(settings => {
      this.currentSettings = settings;
    });

    this.translationService.getTranslations$().subscribe(translations => {
      this.translations = translations;
    });
  }

  ngOnDestroy() {
    if (this.settingsSubscription) {
      this.settingsSubscription.unsubscribe();
    }
  }

  onThemeChange(theme: 'light' | 'dark') {
    // S'assurer qu'un seul thème est sélectionné
    if (theme !== this.currentSettings.theme) {
      this.settingsService.setTheme(theme);
    }
  }

  onLanguageChange(language: 'fr' | 'en') {
    // S'assurer qu'une seule langue est sélectionnée
    if (language !== this.currentSettings.language) {
      this.settingsService.setLanguage(language);
    }
  }

  saveSettings() {
    // Les changements sont appliqués immédiatement, donc on confirme juste
    alert(this.translations['settingsSaved'] || 'Paramètres sauvegardés avec succès!');
  }

  isLightThemeActive(): boolean {
    return this.currentSettings.theme === 'light';
  }

  isDarkThemeActive(): boolean {
    return this.currentSettings.theme === 'dark';
  }

  isFrenchActive(): boolean {
    return this.currentSettings.language === 'fr';
  }

  isEnglishActive(): boolean {
    return this.currentSettings.language === 'en';
  }
}