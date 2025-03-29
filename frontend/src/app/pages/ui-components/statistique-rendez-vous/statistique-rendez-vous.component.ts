import { Component, ElementRef, NgZone, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { RendezVousClientService } from '../../../services/rendez-vous-client.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

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
  private root!: am5.Root;
  statistiques: Statistiques = { moisTotaux: [] };
  moisSelectionne: number = new Date().getMonth() + 1;
  anneeSelectionnee: number = new Date().getFullYear();
  moisTotaux: number[] = [];

  constructor(
    private rendez_vous_clientService: RendezVousClientService,
    private zone: NgZone
  ) { }

  ngOnInit(): void {
    this.loadStatistiques();
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
    // let xAxis = chart.xAxes.push(
    //   am5xy.CategoryAxis.new(this.root, {
    //     categoryField: "mois",
    //     renderer: am5xy.AxisRendererX.new(this.root, {})
    //   })
    // );

    // Création de l'axe X (Mois)
    let xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(this.root, {
        categoryField: "mois",
        renderer: am5xy.AxisRendererX.new(this.root, {
          minGridDistance: 30 // Ajuste l'espace entre les labels
        })
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



}