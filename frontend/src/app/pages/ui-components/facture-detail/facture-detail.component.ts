import { Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-facture-detail',
  imports: [CommonModule,MaterialModule],
  templateUrl: './facture-detail.component.html',
  styleUrl: './facture-detail.component.scss'
})
export class FactureDetailComponent implements OnInit {
  facture: any = null; 
  total: number = 0;
  displayedColumns: string[] = ['service', 'cout'];

  @ViewChild('facturePDF', { static: false }) facturePDF!: ElementRef;

  ngOnInit(): void {
    if (history.state.factures) {
      this.facture = history.state.factures; 
      this.total = this.facture.total; 
    } else {
      this.facture = null;
    }
    console.log("Venant facture :", this.facture);
  }

  exporterPDF(): void {
    const element = document.getElementById('facturePDF');

    if (element) {
      html2canvas(element, {
        scale: 2, // Augmente la qualité de l'image
        useCORS: true, // Évite les erreurs CORS
        logging: false,
        backgroundColor: '#ffffff' // Fond blanc pour éviter le noir par défaut
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png', 1.0); // Compression max
        const pdf = new jsPDF('p', 'mm', 'a4');

        const imgWidth = 190;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
        pdf.save(`facture_${this.facture._id}.pdf`);
      }).catch((error) => {
        console.error('Erreur lors de la génération du PDF :', error);
      });
    }
  }
  
}
