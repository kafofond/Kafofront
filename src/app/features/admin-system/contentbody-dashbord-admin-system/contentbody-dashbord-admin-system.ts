import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { StatistiquesService } from '../../../services/statistiques.service';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-contentbody-dashbord-admin-system',
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './contentbody-dashbord-admin-system.html',
  styleUrl: './contentbody-dashbord-admin-system.css'
})
export class ContentbodyDashbordAdminSystem implements OnInit {
  
  stats = {
    utilisateursActifs: 0,
    entreprisesActives: 0,
    totalUtilisateurs: 0,
    totalEntreprises: 0,
    pourcentageUtilisateursActifs: 0,
    pourcentageEntreprisesActives: 0
  };

  totalDocuments: number = 0;
  isLoading: boolean = true;
  chartLoading: boolean = true;
  errorMessage: string = '';
  currentPeriode: string = 'semaine';

  public lineChartData: ChartConfiguration['data'] = {
  labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
  datasets: [
    {
      data: [1, 1, 2, 2, 1, 1, 1],
      label: 'Entreprises actives',
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
      data: [1, 2, 3, 4, 3, 2, 1],
      label: 'Utilisateurs actifs',
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
      data: [2, 3, 5, 4, 6, 4, 3],
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
        cornerRadius: 8
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
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            size: 11
          }
        }
      }
    }
  };

  public lineChartType: ChartType = 'line';

  constructor(private statistiquesService: StatistiquesService) {}

  ngOnInit() {
    this.loadDashboardData();
    this.loadChartData(this.currentPeriode);
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.statistiquesService.getDashboardStats().subscribe({
      next: (data: any) => {
        this.stats = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des statistiques';
        this.isLoading = false;
      }
    });

    this.statistiquesService.getDocumentsStats().subscribe({
      next: (data: any) => {
        this.totalDocuments = data.totalDocuments;
      },
      error: (error) => {
        this.totalDocuments = 0;
      }
    });
  }

  loadChartData(periode: string): void {
    this.chartLoading = true;
    this.currentPeriode = periode;
    
    this.statistiquesService.getChartData(periode).subscribe({
      next: (data: any) => {
        this.updateChartWithData(data);
        this.chartLoading = false;
      },
      error: (error) => {
        this.chartLoading = false;
      }
    });
  }

  updateChartWithData(chartData: any): void {
    if (chartData && chartData.labels && chartData.datasets) {
      this.lineChartData.labels = chartData.labels;
      this.lineChartData.datasets[0].data = chartData.datasets.entreprises || [1, 1, 2, 2, 1, 1, 1];
       this.lineChartData.datasets[1].data = chartData.datasets.utilisateurs || [1, 2, 3, 4, 3, 2, 1];
      this.lineChartData.datasets[2].data = chartData.datasets.documents || [2, 3, 5, 4, 6, 4, 3];
      
      this.lineChartData = {...this.lineChartData};
    }
  }

  onPeriodeChange(periode: string): void {
    this.loadChartData(periode);
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('fr-FR').format(num);
  }

  exportChart(): void {
    const dataToExport = {
      timestamp: new Date().toISOString(),
      periode: this.currentPeriode,
      statistiques: this.stats,
      donneesGraphique: this.lineChartData
    };
    
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dashboard-stats-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}