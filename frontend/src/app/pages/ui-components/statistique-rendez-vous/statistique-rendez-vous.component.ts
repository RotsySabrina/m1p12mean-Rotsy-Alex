import { Component, ElementRef, NgZone, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { RendezVousClientService } from '../../../services/rendez-vous-client.service';
import { DevisService } from '../../../services/devis.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5percent from "@amcharts/amcharts5/percent";

interface Statistiques {
  moisTotaux: { mois: number, count: number }[];
}

@Component({
  selector: 'app-statistique-rendez-vous',
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  templateUrl: './statistique-rendez-vous.component.html',
  styleUrls: ['./statistique-rendez-vous.component.scss']
})
export class StatistiqueRendezVousComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('chartDiv', { static: false }) chartDiv!: ElementRef;
  @ViewChild('pieChartDiv', { static: false }) pieChartDiv!: ElementRef;

  private root!: am5.Root;
  private rootDevis!: am5.Root;

  statistiques: Statistiques = { moisTotaux: [] };
  moisSelectionne: number = new Date().getMonth() + 1;
  anneeSelectionnee: number = new Date().getFullYear();
  moisTotaux: number[] = [];
  anneeDevis: number = new Date().getFullYear();
  anneesDisponibles: number[] = [];


  constructor(
    private rendez_vous_clientService: RendezVousClientService,
    private devisService: DevisService,
    private zone: NgZone
  ) { }

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
  for (let i = currentYear - 2; i <= currentYear + 2; i++) {
    this.anneesDisponibles.push(i);
  }
  this.anneeSelectionnee = currentYear;
  this.anneeDevis = currentYear;
    this.loadStatistiques();
    this.loadDevisStats();
  }

  loadDevisStats(): void {
    this.devisService.getStat(this.anneeDevis.toString()).subscribe(
      (statsDevis) => {
        console.log("📦 Stats devis reçues :", statsDevis);
        this.afficherPieChart(statsDevis);
      },
      error => {
        console.error("❌ Erreur lors de la récupération des stats de devis :", error);
      }
    );
  }  

  ngAfterViewInit(): void {
    // Assurez-vous que chartDiv est bien défini avant d'appeler afficherGraphique
    if (this.chartDiv) {
      this.afficherGraphique();
    }
  }

  ngOnDestroy(): void {
    if (this.root) {
      this.root.dispose();
    }
    if (this.rootDevis) {
      this.rootDevis.dispose();
    }
  }

  loadStatistiques(): void {
    this.rendez_vous_clientService.getStatistiquesParAnnee(this.anneeSelectionnee).subscribe(
      (data: Statistiques) => {
        console.log("📦 Données reçues du backend:", data);
        this.statistiques = data;
        this.calculerTotauxParMois(data);

        // Vérifier si les données sont bien stockées avant de générer le graphique
        console.log("📊 Données à afficher après transformation :", this.statistiques.moisTotaux);

        // Appeler afficherGraphique après que les données soient bien récupérées
        this.afficherGraphique();
      },
      error => {
        console.error('❌ Erreur lors de la récupération des statistiques', error);
      }
    );
  }


  calculerTotauxParMois(data: Statistiques): void {
    let moisTotaux = Array(12).fill(0);
    data.moisTotaux.forEach((rendezvous: any) => {
      moisTotaux[rendezvous.mois - 1] = rendezvous.count; // Mettre le count du mois approprié
    });
    this.moisTotaux = moisTotaux;
  }

  afficherGraphique(): void {
    console.log("🚀 afficherGraphique() appelé !");

    if (!this.chartDiv) {
      console.error("❌ Erreur : chartDiv est introuvable !");
      return;
    }

    console.log("✅ chartDiv trouvé :", this.chartDiv.nativeElement);

    if (this.root) {
      console.log("♻️ Suppression de l'ancien graphique...");
      this.root.dispose();
    }

    // Création du Root amCharts
    this.root = am5.Root.new(this.chartDiv.nativeElement);
    console.log("✅ amCharts Root initialisé !");

    // Application du thème animé
    this.root.setThemes([am5themes_Animated.new(this.root)]);

    // Création du Chart XY
    let chart = this.root.container.children.push(
      am5xy.XYChart.new(this.root, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        layout: this.root.verticalLayout
      })
    );

    // Création de l'axe X (Mois)
    let xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(this.root, {
        categoryField: "mois",
        renderer: am5xy.AxisRendererX.new(this.root, {
          minGridDistance: 30 // Ajuste l'espace entre les labels
        })
      })
    );

    // Ajouter un label "Mois" à l'axe X
    xAxis.children.push(
      am5.Label.new(this.root, {
        text: "Mois",
        x: am5.p50, // Centre horizontalement
        centerX: am5.p50,
        paddingTop: 10
      })
    );

    // Forcer l'affichage de tous les labels des mois
    xAxis.get("renderer").labels.template.setAll({
      rotation: -45, // Incliner pour éviter le chevauchement
      centerY: am5.p50,
      centerX: am5.p50
    });
    xAxis.get("renderer").grid.template.setAll({
      location: 1
    });

    // Création de l'axe Y (Nombre de rendez-vous)
    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(this.root, {
        renderer: am5xy.AxisRendererY.new(this.root, {})
      })
    );

    // Ajouter un label "Nombre" à l'axe Y
    yAxis.children.push(
      am5.Label.new(this.root, {
        text: "Nombre",
        rotation: -90, // Rotation verticale pour l'axe Y
        y: am5.p50, // Centre verticalement
        centerX: am5.p50
      })
    );

    // Tableau des noms de mois
    const moisNoms = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    // Vérification des données
    console.log("📦 Données originales pour le graphique :", this.statistiques.moisTotaux);

    // Vérifier si on a bien des données avant de continuer
    if (!this.statistiques.moisTotaux || this.statistiques.moisTotaux.length === 0) {
      console.warn("⚠️ Aucune donnée disponible pour le graphique !");
      return;
    }

    // Création des données du graphique avec les noms des mois
    let chartData = this.statistiques.moisTotaux.map((item: any) => ({
      mois: moisNoms[item.mois - 1], // Remplacer le numéro par le nom du mois
      count: item.count
    }));

    console.log("📊 Données formatées pour le graphique :", chartData);

    // Vérifier si les données formatées sont valides
    if (chartData.length === 0) {
      console.warn("⚠️ Données formatées vides !");
      return;
    }

    // Création de la série de données
    let series = chart.series.push(
      am5xy.ColumnSeries.new(this.root, {
        name: "Rendez-vous",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "count",
        categoryXField: "mois"
      })
    );

    xAxis.data.setAll(chartData);
    series.data.setAll(chartData);
  }

  afficherPieChart(devisStats: any): void {
    console.log("🚀 afficherPieChart() appelé avec les stats de devis :", devisStats);
  
    if (this.pieChartDiv) {
      console.log("✅ pieChartDiv trouvé :", this.pieChartDiv.nativeElement);
  
      if (this.rootDevis) {
        console.log("♻️ Suppression de l'ancien graphique...");
        this.rootDevis.dispose();
      }
  
      this.zone.runOutsideAngular(() => {
        this.rootDevis = am5.Root.new(this.pieChartDiv.nativeElement);
        console.log("✅ Nouveau Root amCharts créé !");
  
        this.rootDevis.setThemes([am5themes_Animated.new(this.rootDevis)]);
  
        let chart = this.rootDevis.container.children.push(
          am5percent.PieChart.new(this.rootDevis, {
            layout: this.rootDevis.verticalLayout,
            width: am5.percent(100),  // Utiliser toute la largeur disponible du conteneur parent
            height: am5.percent(100)
          })
        );
  
        let series = chart.series.push(
          am5percent.PieSeries.new(this.rootDevis, {
            valueField: "value",
            categoryField: "category",
            radius: am5.percent(60) 
          })
        );
  
        const data = [
          { category: "Acceptés", value: devisStats.taux_acceptes },
          { category: "Refusés", value: devisStats.taux_refuses },
          { category: "En attente", value: devisStats.taux_en_attente }
        ];
  
        console.log("📊 Ajout des données au graphique pie : ", data);
  
        series.data.setAll(data);
  
        // Ajouter les labels
        series.labels.template.set("text", "{category}: {value} ({value.percent.formatNumber('0.00')}%)");
        series.labels.template.setAll({
          fontSize: 10,  
          maxWidth: 100  
        });
  
        console.log("✅ Graphique Pie créé et mis à jour avec succès !");
      });
    } else {
      console.error("❌ Erreur : pieChartDiv introuvable !");
    }
  }  

}