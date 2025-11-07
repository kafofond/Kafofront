import { Injectable } from '@angular/core';
import { SettingsService } from './settings.service';
import { map } from 'rxjs/operators';

// Interface pour typer les traductions
interface TranslationKeys {
  // Paramètres
  saveChanges: string;
  appearanceTheme: string;
  lightTheme: string;
  lightThemeDesc: string;
  darkTheme: string;
  darkThemeDesc: string;
  languages: string;
  french: string;
  frenchDesc: string;
  english: string;
  englishDesc: string;
  
  // Messages
  settingsSaved: string;
  selectOneTheme: string;
  selectOneLanguage: string;
}

interface Translations {
  fr: TranslationKeys;
  en: TranslationKeys;
}

const translations: Translations = {
  fr: {
    // Paramètres
    saveChanges: 'Sauvegarder Modification',
    appearanceTheme: 'Apparence et Thème',
    lightTheme: 'Thème Clair',
    lightThemeDesc: 'Utilise un arrière-plan clair avec du texte sombre',
    darkTheme: 'Thème sombre',
    darkThemeDesc: 'Utilise un arrière-plan sombre avec du texte clair',
    languages: 'Langues',
    french: 'Français',
    frenchDesc: 'Utiliser la langue par défaut de l\'application',
    english: 'Anglais',
    englishDesc: 'Modifier la langue par défaut de l\'application',
    
    // Messages
    settingsSaved: 'Paramètres sauvegardés avec succès!',
    selectOneTheme: 'Veuillez sélectionner un seul thème',
    selectOneLanguage: 'Veuillez sélectionner une seule langue'
  },
  en: {
    // Settings
    saveChanges: 'Save Changes',
    appearanceTheme: 'Appearance and Theme',
    lightTheme: 'Light Theme',
    lightThemeDesc: 'Use light background with dark text',
    darkTheme: 'Dark Theme',
    darkThemeDesc: 'Use dark background with light text',
    languages: 'Languages',
    french: 'French',
    frenchDesc: 'Use the default application language',
    english: 'English',
    englishDesc: 'Change the default application language',
    
    // Messages
    settingsSaved: 'Settings saved successfully!',
    selectOneTheme: 'Please select only one theme',
    selectOneLanguage: 'Please select only one language'
  }
};

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  constructor(private settingsService: SettingsService) {}

  getTranslation(key: keyof TranslationKeys): string {
    const settings = this.settingsService.getCurrentSettings();
    const langTranslations = translations[settings.language];
    return langTranslations[key] || key;
  }

  getTranslations$() {
    return this.settingsService.settings$.pipe(
      map(settings => translations[settings.language])
    );
  }

  // Méthode alternative si vous avez besoin d'accéder avec des strings dynamiques
  getTranslationSafe(key: string): string {
    const settings = this.settingsService.getCurrentSettings();
    const langTranslations = translations[settings.language];
    
    // Vérification de type sécurisée
    if (key in langTranslations) {
      return langTranslations[key as keyof TranslationKeys];
    }
    
    return key; // Retourne la clé si la traduction n'existe pas
  }
}