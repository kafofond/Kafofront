import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { StatistiquesService, DsiDashboardStats, DsiChartData } from '../../../services/statistiques.service';
import { Chart, registerables } from 'chart.js';
import { Subscription, timer } from 'rxjs';
Chart.register(...registerables);

@Component({
  selector: 'app-contentbody-dashbord-dsi',
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './contentbody-dashbord-dsi.html',
  styleUrl: './contentbody-dashbord-dsi.css'
})
export class ContentbodyDashbordDsi implements OnInit, OnDestroy {
  
  stats: DsiDashboardStats = {
    totalUsers: 0,
    disabledUsers: 0,
    sharedDocuments: 0,
    activeUsersPercentage: 0,
    disabledUsersPercentage: 0,
    documentsPercentage: 0
  };

  isLoading: boolean = true;
  chartLoading: boolean = true;
  errorMessage: string = '';
  currentPeriode: string = 'semaine';
  lastUpdate: Date = new Date();

  // Pour le rafraîchissement automatique
  private refreshSubscription?: Subscription;
  private readonly REFRESH_INTERVAL = 60000; // 1 minute

  public lineChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Utilisateurs actifs',
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
        label: 'Utilisateurs désactivés',
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
        label: 'Documents partagés',
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
    console.log('🚀 Initialisation du dashboard DSI (données entreprise)...');
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
    
    this.statistiquesService.getDsiDashboardStats().subscribe({
      next: (data: DsiDashboardStats) => {
        console.log('✅ Données DSI entreprise reçues:', data);
        this.stats = this.validateStats(data);
        this.lastUpdate = new Date();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Erreur DSI dashboard entreprise:', error);
        this.errorMessage = 'Erreur lors du chargement des statistiques de votre entreprise';
        this.isLoading = false;
      }
    });
  }

  loadChartData(periode: string): void {
    this.chartLoading = true;
    this.currentPeriode = periode;
    
    this.statistiquesService.getDsiChartData(periode).subscribe({
      next: (data: DsiChartData) => {
        console.log(`📈 Données graphique DSI ${periode} reçues:`, data);
        this.updateChartWithData(data);
        this.chartLoading = false;
      },
      error: (error) => {
        console.error(`❌ Erreur graphique DSI ${periode}:`, error);
        this.chartLoading = false;
      }
    });
  }

  updateChartWithData(chartData: DsiChartData): void {
    if (chartData && chartData.labels && chartData.datasets) {
      this.lineChartData = {
        labels: chartData.labels,
        datasets: [
          {
            ...this.lineChartData.datasets[0],
            data: chartData.datasets.utilisateurs
          },
          {
            ...this.lineChartData.datasets[1],
            data: chartData.datasets.desactivations
          },
          {
            ...this.lineChartData.datasets[2],
            data: chartData.datasets.documents
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
        console.log('🔄 Rafraîchissement automatique des données DSI...');
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
    console.log('🔄 Rafraîchissement manuel des données DSI...');
    this.statistiquesService.invalidateCache('dsi');
    this.loadAllData();
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('fr-FR').format(num);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  }

  exportChart(): void {
    const dataToExport = {
      timestamp: new Date().toISOString(),
      entreprise: 'Votre entreprise', // À adapter si vous avez le nom de l'entreprise
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
    link.download = `dashboard-dsi-entreprise-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  // Validation des statistiques
  private validateStats(data: DsiDashboardStats): DsiDashboardStats {
    const validated = {
      totalUsers: Math.max(0, data.totalUsers || 0),
      disabledUsers: Math.max(0, data.disabledUsers || 0),
      sharedDocuments: Math.max(0, data.sharedDocuments || 0),
      activeUsersPercentage: Math.max(0, Math.min(100, data.activeUsersPercentage || 0)),
      disabledUsersPercentage: Math.max(0, Math.min(100, data.disabledUsersPercentage || 0)),
      documentsPercentage: Math.max(0, Math.min(100, data.documentsPercentage || 0))
    };
    
    console.log('🔍 Statistiques entreprise après validation:', validated);
    return validated;
  }

  // Méthodes pour les progress bars
  getActiveUsersWidth(): string {
    const percentage = Math.max(0, Math.min(100, this.stats.activeUsersPercentage || 0));
    return `${percentage}%`;
  }

  getDisabledUsersWidth(): string {
    const percentage = Math.max(0, Math.min(100, this.stats.disabledUsersPercentage || 0));
    return `${percentage}%`;
  }

  getDocumentsWidth(): string {
    const percentage = Math.max(0, Math.min(100, this.stats.documentsPercentage || 0));
    return `${percentage}%`;
  }

  // Indicateur de données vides
  hasData(): boolean {
    return this.stats.totalUsers > 0 || this.stats.sharedDocuments > 0;
  }
}