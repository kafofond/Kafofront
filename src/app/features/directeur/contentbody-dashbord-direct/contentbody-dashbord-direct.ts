import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { StatistiquesService, DirecteurDashboardStats, DirecteurChartData } from '../../../services/statistiques.service';
import { Chart, registerables } from 'chart.js';
import { Subscription, timer } from 'rxjs';
Chart.register(...registerables);

@Component({
  selector: 'app-contentbody-dashbord-direct',
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './contentbody-dashbord-direct.html',
  styleUrl: './contentbody-dashbord-direct.css'
})
export class ContentbodyDashbordDirect implements OnInit, OnDestroy {
  
  stats: DirecteurDashboardStats = {
    totalBudget: 0,
    totalLignesCredit: 0,
    totalDepenses: 0,
    budgetEnCours: 0,
    lignesCreditEnAttente: 0,
    depensesEnAttente: 0,
    budgetPercentage: 0,
    lignesCreditPercentage: 0,
    depensesPercentage: 0
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
        label: 'Budgets',
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
        label: 'Lignes de crédit',
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
        label: 'Dépenses',
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
    console.log('💰 Initialisation du dashboard Directeur (données financières)...');
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
    
    this.statistiquesService.getDirecteurDashboardStats().subscribe({
      next: (data: DirecteurDashboardStats) => {
        console.log('✅ Données Directeur financières reçues:', data);
        this.stats = this.validateStats(data);
        this.lastUpdate = new Date();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Erreur Directeur dashboard financier:', error);
        this.errorMessage = 'Erreur lors du chargement des données financières';
        this.isLoading = false;
      }
    });
  }

  loadChartData(periode: string): void {
    this.chartLoading = true;
    this.currentPeriode = periode;
    
    this.statistiquesService.getDirecteurChartData(periode).subscribe({
      next: (data: DirecteurChartData) => {
        console.log(`📊 Données graphique Directeur ${periode} reçues:`, data);
        this.updateChartWithData(data);
        this.chartLoading = false;
      },
      error: (error) => {
        console.error(`❌ Erreur graphique Directeur ${periode}:`, error);
        this.chartLoading = false;
      }
    });
  }

  updateChartWithData(chartData: DirecteurChartData): void {
    if (chartData && chartData.labels && chartData.datasets) {
      this.lineChartData = {
        labels: chartData.labels,
        datasets: [
          {
            ...this.lineChartData.datasets[0],
            data: chartData.datasets.budgets
          },
          {
            ...this.lineChartData.datasets[1],
            data: chartData.datasets.lignesCredit
          },
          {
            ...this.lineChartData.datasets[2],
            data: chartData.datasets.depenses
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
        console.log('🔄 Rafraîchissement automatique des données Directeur...');
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
    console.log('🔄 Rafraîchissement manuel des données Directeur...');
    this.statistiquesService.invalidateCache('directeur');
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
      role: 'Directeur',
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
    link.download = `dashboard-directeur-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  // Validation des statistiques
  private validateStats(data: DirecteurDashboardStats): DirecteurDashboardStats {
    const validated = {
      totalBudget: Math.max(0, data.totalBudget || 0),
      totalLignesCredit: Math.max(0, data.totalLignesCredit || 0),
      totalDepenses: Math.max(0, data.totalDepenses || 0),
      budgetEnCours: Math.max(0, data.budgetEnCours || 0),
      lignesCreditEnAttente: Math.max(0, data.lignesCreditEnAttente || 0),
      depensesEnAttente: Math.max(0, data.depensesEnAttente || 0),
      budgetPercentage: Math.max(0, Math.min(100, data.budgetPercentage || 0)),
      lignesCreditPercentage: Math.max(0, Math.min(100, data.lignesCreditPercentage || 0)),
      depensesPercentage: Math.max(0, Math.min(100, data.depensesPercentage || 0))
    };
    
    console.log('🔍 Statistiques directeur après validation:', validated);
    return validated;
  }

  // Méthodes pour les progress bars
  getBudgetWidth(): string {
    const percentage = Math.max(0, Math.min(100, this.stats.budgetPercentage || 0));
    return `${percentage}%`;
  }

  getLignesCreditWidth(): string {
    const percentage = Math.max(0, Math.min(100, this.stats.lignesCreditPercentage || 0));
    return `${percentage}%`;
  }

  getDepensesWidth(): string {
    const percentage = Math.max(0, Math.min(100, this.stats.depensesPercentage || 0));
    return `${percentage}%`;
  }

  // Indicateur de données vides
  hasData(): boolean {
    return this.stats.totalBudget > 0 || this.stats.totalLignesCredit > 0 || this.stats.totalDepenses > 0;
  }
}