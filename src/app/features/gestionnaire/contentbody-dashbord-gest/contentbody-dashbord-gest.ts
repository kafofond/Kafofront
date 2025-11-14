import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { StatistiquesService, GestionnaireDashboardStats, GestionnaireChartData } from '../../../services/statistiques.service';
import { Chart, registerables } from 'chart.js';
import { Subscription, timer } from 'rxjs';
Chart.register(...registerables);

@Component({
  selector: 'app-contentbody-dashbord-gest',
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './contentbody-dashbord-gest.html',
  styleUrl: './contentbody-dashbord-gest.css'
})
export class ContentbodyDashbordGest implements OnInit, OnDestroy {
  
  stats: GestionnaireDashboardStats = {
    totalLignesCredit: 0,
    totalFichesBesoin: 0,
    totalDemandesAchat: 0,
    lignesCreditEnAttente: 0,
    fichesBesoinEnAttente: 0,
    demandesAchatEnAttente: 0,
    pourcentageLignesCreditTraitees: 0,
    pourcentageFichesBesoinTraitees: 0
  };

  isLoading: boolean = true;
  chartLoading: boolean = true;
  errorMessage: string = '';
  currentPeriode: string = 'semaine';
  lastUpdate: Date = new Date();

  // Pour le rafraîchissement automatique
  private refreshSubscription?: Subscription;
  private readonly REFRESH_INTERVAL = 60000; // 1 minute

  // Configuration du graphique
  public lineChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Lignes de crédit',
        backgroundColor: 'rgba(20, 181, 58, 0.2)',
        borderColor: '#14b53a',
        pointBackgroundColor: '#14b53a',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#14b53a',
        fill: 'origin',
        tension: 0.4
      },
      {
        data: [],
        label: 'Fiches de besoin',
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        borderColor: '#f59e0b',
        pointBackgroundColor: '#f59e0b',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#f59e0b',
        fill: 'origin',
        tension: 0.4
      },
      {
        data: [],
        label: 'Demandes d\'achat',
        backgroundColor: 'rgba(245, 25, 25, 0.2)',
        borderColor: '#f51919',
        pointBackgroundColor: '#f51919',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#f51919',
        fill: 'origin',
        tension: 0.4
      }
    ]
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#0b4f63',
        bodyColor: '#333',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('fr-FR').format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'category',
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11
          }
        }
      },
      y: {
        type: 'linear',
        beginAtZero: true,
        min: 0,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            size: 11
          },
          callback: function(value) {
            return new Intl.NumberFormat('fr-FR').format(Number(value));
          }
        }
      }
    }
  };

  public lineChartType: ChartType = 'line';

  constructor(private statistiquesService: StatistiquesService) {}

  ngOnInit() {
    console.log('📊 Initialisation du dashboard Gestionnaire...');
    this.loadAllData();
    this.startAutoRefresh();
  }

  ngOnDestroy() {
    this.stopAutoRefresh();
  }

  loadAllData(): void {
    this.loadDashboardData();
    this.loadChartData(this.currentPeriode);
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.statistiquesService.getGestionnaireDashboardStats().subscribe({
      next: (data: GestionnaireDashboardStats) => {
        console.log('✅ Données Gestionnaire reçues:', data);
        this.stats = this.validateStats(data);
        this.lastUpdate = new Date();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Erreur Gestionnaire dashboard:', error);
        this.errorMessage = 'Erreur lors du chargement des données';
        this.isLoading = false;
      }
    });
  }

  loadChartData(periode: string): void {
    this.chartLoading = true;
    this.currentPeriode = periode;
    
    this.statistiquesService.getGestionnaireChartData(periode).subscribe({
      next: (data: GestionnaireChartData) => {
        console.log(`📊 Données graphique Gestionnaire ${periode} reçues:`, data);
        this.updateChartWithData(data);
        this.chartLoading = false;
      },
      error: (error) => {
        console.error(`❌ Erreur graphique Gestionnaire ${periode}:`, error);
        this.chartLoading = false;
      }
    });
  }

  updateChartWithData(chartData: GestionnaireChartData): void {
    if (chartData && chartData.labels && chartData.datasets) {
      this.lineChartData = {
        labels: chartData.labels,
        datasets: [
          {
            ...this.lineChartData.datasets[0],
            data: chartData.datasets.lignesCredit
          },
          {
            ...this.lineChartData.datasets[1],
            data: chartData.datasets.fichesBesoin
          },
          {
            ...this.lineChartData.datasets[2],
            data: chartData.datasets.demandesAchat
          }
        ]
      };
    }
  }

  onPeriodeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const periode = selectElement.value;
    this.loadChartData(periode);
  }

  // Rafraîchissement automatique
  startAutoRefresh(): void {
    this.refreshSubscription = timer(this.REFRESH_INTERVAL, this.REFRESH_INTERVAL)
      .subscribe(() => {
        console.log('🔄 Rafraîchissement automatique des données Gestionnaire...');
        this.loadAllData();
      });
  }

  stopAutoRefresh(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  // Rafraîchissement manuel
  manualRefresh(): void {
    console.log('🔄 Rafraîchissement manuel des données Gestionnaire...');
    this.statistiquesService.invalidateCache('gestionnaire');
    this.loadAllData();
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('fr-FR').format(num);
  }

  formatCurrency(num: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF'
    }).format(num);
  }

  exportChart(): void {
    const dataToExport = {
      timestamp: new Date().toISOString(),
      role: 'Gestionnaire',
      periode: this.currentPeriode,
      statistiques: this.stats,
      donneesGraphique: this.lineChartData,
      dernierRafraichissement: this.lastUpdate.toISOString()
    };
    
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dashboard-gestionnaire-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  // Validation des statistiques
  private validateStats(data: GestionnaireDashboardStats): GestionnaireDashboardStats {
    const validated = {
      totalLignesCredit: Math.max(0, data.totalLignesCredit || 0),
      totalFichesBesoin: Math.max(0, data.totalFichesBesoin || 0),
      totalDemandesAchat: Math.max(0, data.totalDemandesAchat || 0),
      lignesCreditEnAttente: Math.max(0, data.lignesCreditEnAttente || 0),
      fichesBesoinEnAttente: Math.max(0, data.fichesBesoinEnAttente || 0),
      demandesAchatEnAttente: Math.max(0, data.demandesAchatEnAttente || 0),
      pourcentageLignesCreditTraitees: Math.max(0, Math.min(100, data.pourcentageLignesCreditTraitees || 0)),
      pourcentageFichesBesoinTraitees: Math.max(0, Math.min(100, data.pourcentageFichesBesoinTraitees || 0))
    };
    
    console.log('🔍 Statistiques gestionnaire après validation:', validated);
    return validated;
  }

  // Méthodes pour les progress bars
  getLignesCreditWidth(): string {
    const percentage = Math.max(0, Math.min(100, this.stats.pourcentageLignesCreditTraitees || 0));
    return `${percentage}%`;
  }

  getFichesBesoinWidth(): string {
    const percentage = Math.max(0, Math.min(100, this.stats.pourcentageFichesBesoinTraitees || 0));
    return `${percentage}%`;
  }

  getDemandesAchatWidth(): string {
    // Calcul du pourcentage pour les demandes d'achat
    const total = this.stats.totalDemandesAchat || 1;
    const processed = total - (this.stats.demandesAchatEnAttente || 0);
    const percentage = Math.max(0, Math.min(100, (processed / total) * 100));
    return `${percentage}%`;
  }

  // Indicateur de données vides
  hasData(): boolean {
    return this.stats.totalLignesCredit > 0 || this.stats.totalFichesBesoin > 0 || this.stats.totalDemandesAchat > 0;
  }

  // Méthode pour calculer le pourcentage de demandes d'achat traitées
  getDemandesAchatPercentage(): number {
    if (this.stats.totalDemandesAchat <= 0) {
      return 0;
    }
    const processed = this.stats.totalDemandesAchat - this.stats.demandesAchatEnAttente;
    return Math.round((processed / this.stats.totalDemandesAchat) * 100);
  }
}