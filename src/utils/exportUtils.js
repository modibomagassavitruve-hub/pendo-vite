import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

/**
 * Exporter les données du portefeuille en PDF
 */
export const exportPortfolioPDF = (portfolioData, summary) => {
  const doc = new jsPDF();

  // En-tête
  doc.setFontSize(20);
  doc.setTextColor(249, 115, 22); // Orange
  doc.text('PENDO - Rapport de Portefeuille', 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 14, 28);

  // Résumé financier
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Résumé Financier', 14, 40);

  const summaryData = [
    ['Valeur Totale du Portefeuille', formatCurrency(summary.portfolioValue)],
    ['Investissement Total', formatCurrency(summary.totalCost)],
    ['Gain/Perte Total', formatCurrency(summary.totalGainLoss)],
    ['Rendement (%)', `${summary.totalGainLossPercent >= 0 ? '+' : ''}${summary.totalGainLossPercent.toFixed(2)}%`],
    ['Solde Disponible', formatCurrency(summary.cashBalance)],
    ['Nombre de Positions', summary.numberOfHoldings.toString()]
  ];

  autoTable(doc, {
    startY: 45,
    head: [['Indicateur', 'Valeur']],
    body: summaryData,
    theme: 'striped',
    headStyles: { fillColor: [249, 115, 22] },
    margin: { left: 14 }
  });

  // Détails des positions
  doc.setFontSize(14);
  doc.text('Détails des Positions', 14, doc.previousAutoTable.finalY + 15);

  const holdingsData = portfolioData.map(holding => [
    holding.market_id,
    holding.stock_name || holding.market_id,
    holding.quantity.toString(),
    formatCurrency(holding.average_price),
    formatCurrency(holding.current_price),
    formatCurrency(holding.current_value),
    `${holding.gain_loss_percent >= 0 ? '+' : ''}${holding.gain_loss_percent.toFixed(2)}%`
  ]);

  autoTable(doc, {
    startY: doc.previousAutoTable.finalY + 20,
    head: [['Ticker', 'Nom', 'Qté', 'Prix Moy.', 'Prix Act.', 'Valeur', 'Perf. (%)']],
    body: holdingsData,
    theme: 'grid',
    headStyles: { fillColor: [249, 115, 22] },
    styles: { fontSize: 8 },
    margin: { left: 14 }
  });

  // Pied de page
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} sur ${pageCount} | PENDO African Financial Markets`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }

  // Télécharger
  doc.save(`PENDO_Portfolio_${new Date().toISOString().split('T')[0]}.pdf`);
};

/**
 * Exporter les analytics en PDF
 */
export const exportAnalyticsPDF = (portfolioSummary, performanceData, timeRange) => {
  const doc = new jsPDF();

  // En-tête
  doc.setFontSize(20);
  doc.setTextColor(249, 115, 22);
  doc.text('PENDO - Rapport d\'Analyses', 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Période: ${timeRange} jours | Généré le ${new Date().toLocaleDateString('fr-FR')}`, 14, 28);

  // Vue d'ensemble
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Vue d\'ensemble', 14, 40);

  const { holdings, summary } = portfolioSummary;

  // Calculer les statistiques
  const sectorAllocation = {};
  holdings.forEach(h => {
    const sector = h.sector || 'Autres';
    if (!sectorAllocation[sector]) {
      sectorAllocation[sector] = { value: 0, count: 0 };
    }
    sectorAllocation[sector].value += h.current_value || 0;
    sectorAllocation[sector].count += 1;
  });

  const overviewData = [
    ['Valeur Totale', formatCurrency(summary.totalValue)],
    ['Rendement Moyen', `${summary.totalGainLossPercent >= 0 ? '+' : ''}${summary.totalGainLossPercent.toFixed(2)}%`],
    ['Positions Actives', holdings.length.toString()],
    ['Secteurs Représentés', Object.keys(sectorAllocation).length.toString()]
  ];

  autoTable(doc, {
    startY: 45,
    head: [['Indicateur', 'Valeur']],
    body: overviewData,
    theme: 'striped',
    headStyles: { fillColor: [249, 115, 22] },
    margin: { left: 14 }
  });

  // Répartition par secteur
  doc.setFontSize(14);
  doc.text('Répartition par Secteur', 14, doc.previousAutoTable.finalY + 15);

  const sectorData = Object.entries(sectorAllocation).map(([sector, data]) => [
    sector,
    formatCurrency(data.value),
    `${((data.value / summary.totalValue) * 100).toFixed(1)}%`,
    data.count.toString()
  ]);

  autoTable(doc, {
    startY: doc.previousAutoTable.finalY + 20,
    head: [['Secteur', 'Valeur', 'Part (%)', 'Positions']],
    body: sectorData,
    theme: 'grid',
    headStyles: { fillColor: [249, 115, 22] },
    margin: { left: 14 }
  });

  // Top performers
  const topPerformers = [...holdings]
    .sort((a, b) => (b.gain_loss_percent || 0) - (a.gain_loss_percent || 0))
    .slice(0, 5);

  if (topPerformers.length > 0) {
    doc.addPage();
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Top 5 Meilleures Performances', 14, 20);

    const topData = topPerformers.map(h => [
      h.market_id,
      h.stock_name || h.market_id,
      formatCurrency(h.current_value),
      `${h.gain_loss_percent >= 0 ? '+' : ''}${h.gain_loss_percent.toFixed(2)}%`,
      formatCurrency(h.gain_loss)
    ]);

    autoTable(doc, {
      startY: 25,
      head: [['Ticker', 'Nom', 'Valeur', 'Performance', 'Gain/Perte']],
      body: topData,
      theme: 'grid',
      headStyles: { fillColor: [34, 197, 94] }, // Vert
      margin: { left: 14 }
    });
  }

  // Performance historique
  if (performanceData && performanceData.length > 0) {
    doc.setFontSize(14);
    doc.text('Historique de Performance', 14, doc.previousAutoTable.finalY + 15);

    const perfData = performanceData.slice(0, 10).map(point => [
      new Date(point.date).toLocaleDateString('fr-FR'),
      formatCurrency(point.total_value),
      `${point.total_gain_loss_percent >= 0 ? '+' : ''}${point.total_gain_loss_percent.toFixed(2)}%`,
      formatCurrency(point.total_gain_loss)
    ]);

    autoTable(doc, {
      startY: doc.previousAutoTable.finalY + 20,
      head: [['Date', 'Valeur Totale', 'Rendement', 'Gain/Perte']],
      body: perfData,
      theme: 'striped',
      headStyles: { fillColor: [249, 115, 22] },
      styles: { fontSize: 8 },
      margin: { left: 14 }
    });
  }

  // Pied de page
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} sur ${pageCount} | PENDO African Financial Markets`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }

  doc.save(`PENDO_Analytics_${timeRange}j_${new Date().toISOString().split('T')[0]}.pdf`);
};

/**
 * Exporter le portefeuille en Excel
 */
export const exportPortfolioExcel = (portfolioData, summary) => {
  // Feuille 1: Résumé
  const summarySheet = XLSX.utils.json_to_sheet([
    { 'Indicateur': 'Valeur Totale du Portefeuille', 'Valeur': summary.portfolioValue },
    { 'Indicateur': 'Investissement Total', 'Valeur': summary.totalCost },
    { 'Indicateur': 'Gain/Perte Total', 'Valeur': summary.totalGainLoss },
    { 'Indicateur': 'Rendement (%)', 'Valeur': summary.totalGainLossPercent },
    { 'Indicateur': 'Solde Disponible', 'Valeur': summary.cashBalance },
    { 'Indicateur': 'Nombre de Positions', 'Valeur': summary.numberOfHoldings }
  ]);

  // Feuille 2: Positions
  const holdingsData = portfolioData.map(holding => ({
    'Ticker': holding.market_id,
    'Nom': holding.stock_name || holding.market_id,
    'Secteur': holding.sector || 'N/A',
    'Quantité': holding.quantity,
    'Prix Moyen': holding.average_price,
    'Prix Actuel': holding.current_price,
    'Valeur Totale': holding.current_value,
    'Coût Total': holding.total_cost,
    'Gain/Perte': holding.gain_loss,
    'Performance (%)': holding.gain_loss_percent,
    'Variation Journalière (%)': holding.daily_change
  }));

  const holdingsSheet = XLSX.utils.json_to_sheet(holdingsData);

  // Créer le classeur
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Résumé');
  XLSX.utils.book_append_sheet(workbook, holdingsSheet, 'Positions');

  // Télécharger
  XLSX.writeFile(workbook, `PENDO_Portfolio_${new Date().toISOString().split('T')[0]}.xlsx`);
};

/**
 * Exporter les transactions en Excel
 */
export const exportTransactionsExcel = (transactions) => {
  const transactionsData = transactions.map(tx => ({
    'Date': new Date(tx.transaction_date).toLocaleDateString('fr-FR'),
    'Ticker': tx.ticker,
    'Type': tx.transaction_type === 'buy' ? 'Achat' : 'Vente',
    'Quantité': tx.quantity,
    'Prix': tx.price,
    'Montant Total': tx.total_amount,
    'Frais': tx.fees,
    'Montant Net': tx.net_amount,
    'Notes': tx.notes || ''
  }));

  const worksheet = XLSX.utils.json_to_sheet(transactionsData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');

  XLSX.writeFile(workbook, `PENDO_Transactions_${new Date().toISOString().split('T')[0]}.xlsx`);
};

/**
 * Formater une valeur en devise
 */
function formatCurrency(value) {
  if (!value && value !== 0) return '0 XOF';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(value);
}
