import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { StatistiquesService, ResponsableDashboardStats, ResponsableChartData } from '../../../services/statistiques.service';
import { Chart, registerables } from 'chart.js';
import { Subscription, timer } from 'rxjs';
Chart.register(...registerables);

@Component({
  selector: 'app-contentbody-dashbord-respo',
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './contentbody-dashbord-respo.html',
  styleUrl: './contentbody-dashbord-respo.css'
})
export class ContentbodyDashbordRespo implements OnInit, OnDestroy {
  
  stats: ResponsableDashboardStats = {
    creditsAffectes: 0,
    creditsUtilises: 0,
    creditsRestants: 0,
    pourcentageUtilisation: 0,
    pourcentageRestant: 0,
    budgetTotal: 0
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
        label: 'Crédits affectés',
        backgroundColor: 'rgba(12, 143, 17, 0.2)',
        borderColor: '#0c8f11',
        pointBackgroundColor: '#0c8f11',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#0c8f11',
        fill: 'origin',
        tension: 0.4
      },
      {
        data: [],
        label: 'Crédits utilisés',
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
        label: 'Crédits restants',
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
    console.log('💰 Initialisation du dashboard Responsable (données crédits)...');
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
    
    this.statistiquesService.getResponsableDashboardStats().subscribe({
      next: (data: ResponsableDashboardStats) => {
        console.log('✅ Données Responsable crédits reçues:', data);
        this.stats = this.validateStats(data);
        this.lastUpdate = new Date();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Erreur Responsable dashboard crédits:', error);
        this.errorMessage = 'Erreur lors du chargement des données crédits';
        this.isLoading = false;
      }
    });
  }

  loadChartData(periode: string): void {
    this.chartLoading = true;
    this.currentPeriode = periode;
    
    this.statistiquesService.getResponsableChartData(periode).subscribe({
      next: (data: ResponsableChartData) => {
        console.log(`📊 Données graphique Responsable ${periode} reçues:`, data);
        this.updateChartWithData(data);
        this.chartLoading = false;
      },
      error: (error) => {
        console.error(`❌ Erreur graphique Responsable ${periode}:`, error);
        this.chartLoading = false;
      }
    });
  }

  updateChartWithData(chartData: ResponsableChartData): void {
    if (chartData && chartData.labels && chartData.datasets) {
      this.lineChartData = {
        labels: chartData.labels,
        datasets: [
          {
            ...this.lineChartData.datasets[0],
            data: chartData.datasets.creditsAffectes
          },
          {
            ...this.lineChartData.datasets[1],
            data: chartData.datasets.creditsUtilises
          },
          {
            ...this.lineChartData.datasets[2],
            data: chartData.datasets.creditsRestants
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
        console.log('🔄 Rafraîchissement automatique des données Responsable...');
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
    console.log('🔄 Rafraîchissement manuel des données Responsable...');
    this.statistiquesService.invalidateCache('responsable');
    this.loadAllData();
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('fr-FR').format(num);
  }

  formatCurrency(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + ' M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + ' K';
    }
    return new Intl.NumberFormat('fr-FR').format(num);
  }

  exportChart(): void {
    const dataToExport = {
      timestamp: new Date().toISOString(),
      role: 'Responsable',
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
    link.download = `dashboard-responsable-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  // Validation des statistiques
  private validateStats(data: ResponsableDashboardStats): ResponsableDashboardStats {
    const validated = {
      creditsAffectes: Math.max(0, data.creditsAffectes || 0),
      creditsUtilises: Math.max(0, data.creditsUtilises || 0),
      creditsRestants: Math.max(0, data.creditsRestants || 0),
      pourcentageUtilisation: Math.max(0, Math.min(100, data.pourcentageUtilisation || 0)),
      pourcentageRestant: Math.max(0, Math.min(100, data.pourcentageRestant || 0)),
      budgetTotal: Math.max(0, data.budgetTotal || 0)
    };
    
    console.log('🔍 Statistiques responsable après validation:', validated);
    return validated;
  }

  // Méthodes pour les progress bars
  getAffectesWidth(): string {
    const percentage = Math.max(0, Math.min(100, this.stats.pourcentageUtilisation || 0));
    return `${percentage}%`;
  }

  getUtilisesWidth(): string {
    const percentage = Math.max(0, Math.min(100, this.stats.pourcentageUtilisation || 0));
    return `${percentage}%`;
  }

  getRestantsWidth(): string {
    const percentage = Math.max(0, Math.min(100, this.stats.pourcentageRestant || 0));
    return `${percentage}%`;
  }

  // Indicateur de données vides
  hasData(): boolean {
    return this.stats.creditsAffectes > 0 || this.stats.creditsUtilises > 0 || this.stats.creditsRestants > 0;
  }
}