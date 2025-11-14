import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { StatistiquesService, ComptableDashboardStats, ComptableChartData } from '../../../services/statistiques.service';
import { Chart, registerables } from 'chart.js';
import { Subscription, timer } from 'rxjs';
Chart.register(...registerables);

@Component({
  selector: 'app-contentbody-dashbord-comptable',
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './contentbody-dashbord-comptable.html',
  styleUrl: './contentbody-dashbord-comptable.css'
})
export class ContentbodyDashbordComptable implements OnInit, OnDestroy {
  
  stats: ComptableDashboardStats = {
    totalDemandesAchat: 0,
    totalBonsCommande: 0,
    totalOrdresPaiement: 0,
    demandesEnAttente: 0,
    bonsEnAttente: 0,
    ordresEnAttente: 0,
    pourcentageDemandesTraitees: 0,
    pourcentageBonsValides: 0
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
        label: 'Demandes d\'achat',
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
        label: 'Bons de commande',
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
        label: 'Ordres de paiement',
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
    console.log('💰 Initialisation du dashboard Comptable (données financières)...');
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
    
    this.statistiquesService.getComptableDashboardStats().subscribe({
      next: (data: ComptableDashboardStats) => {
        console.log('✅ Données Comptable financières reçues:', data);
        this.stats = this.validateStats(data);
        this.lastUpdate = new Date();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Erreur Comptable dashboard financier:', error);
        this.errorMessage = 'Erreur lors du chargement des données financières';
        this.isLoading = false;
      }
    });
  }

  loadChartData(periode: string): void {
    this.chartLoading = true;
    this.currentPeriode = periode;
    
    this.statistiquesService.getComptableChartData(periode).subscribe({
      next: (data: ComptableChartData) => {
        console.log(`📊 Données graphique Comptable ${periode} reçues:`, data);
        this.updateChartWithData(data);
        this.chartLoading = false;
      },
      error: (error) => {
        console.error(`❌ Erreur graphique Comptable ${periode}:`, error);
        this.chartLoading = false;
      }
    });
  }

  updateChartWithData(chartData: ComptableChartData): void {
    if (chartData && chartData.labels && chartData.datasets) {
      this.lineChartData = {
        labels: chartData.labels,
        datasets: [
          {
            ...this.lineChartData.datasets[0],
            data: chartData.datasets.demandesAchat
          },
          {
            ...this.lineChartData.datasets[1],
            data: chartData.datasets.bonsCommande
          },
          {
            ...this.lineChartData.datasets[2],
            data: chartData.datasets.ordresPaiement
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
        console.log('🔄 Rafraîchissement automatique des données Comptable...');
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
    console.log('🔄 Rafraîchissement manuel des données Comptable...');
    this.statistiquesService.invalidateCache('comptable');
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
      role: 'Comptable',
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
    link.download = `dashboard-comptable-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  // Validation des statistiques
  private validateStats(data: ComptableDashboardStats): ComptableDashboardStats {
    const validated = {
      totalDemandesAchat: Math.max(0, data.totalDemandesAchat || 0),
      totalBonsCommande: Math.max(0, data.totalBonsCommande || 0),
      totalOrdresPaiement: Math.max(0, data.totalOrdresPaiement || 0),
      demandesEnAttente: Math.max(0, data.demandesEnAttente || 0),
      bonsEnAttente: Math.max(0, data.bonsEnAttente || 0),
      ordresEnAttente: Math.max(0, data.ordresEnAttente || 0),
      pourcentageDemandesTraitees: Math.max(0, Math.min(100, data.pourcentageDemandesTraitees || 0)),
      pourcentageBonsValides: Math.max(0, Math.min(100, data.pourcentageBonsValides || 0))
    };
    
    console.log('🔍 Statistiques comptable après validation:', validated);
    return validated;
  }

  // Méthodes pour les progress bars
  getDemandesWidth(): string {
    const percentage = Math.max(0, Math.min(100, this.stats.pourcentageDemandesTraitees || 0));
    return `${percentage}%`;
  }

  getBonsWidth(): string {
    const percentage = Math.max(0, Math.min(100, this.stats.pourcentageBonsValides || 0));
    return `${percentage}%`;
  }

  getOrdresWidth(): string {
    // Calcul du pourcentage pour les ordres de paiement
    const total = this.stats.totalOrdresPaiement || 1;
    const processed = total - (this.stats.ordresEnAttente || 0);
    const percentage = Math.max(0, Math.min(100, (processed / total) * 100));
    return `${percentage}%`;
  }

  // Indicateur de données vides
  hasData(): boolean {
    return this.stats.totalDemandesAchat > 0 || this.stats.totalBonsCommande > 0 || this.stats.totalOrdresPaiement > 0;
  }

  // Méthode pour calculer le pourcentage d'ordres de paiement traités
  getOrdresPercentage(): number {
    if (this.stats.totalOrdresPaiement <= 0) {
      return 0;
    }
    const processed = this.stats.totalOrdresPaiement - this.stats.ordresEnAttente;
    return Math.round((processed / this.stats.totalOrdresPaiement) * 100);
  }
}