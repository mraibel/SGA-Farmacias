// src/components/ExportPDF.tsx

import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ExportPDF = () => {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;

    const canvas = await html2canvas(contentRef.current);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("reporte.pdf");
  };

  return (
    <div>
      <div
        ref={contentRef}
        id="pdf-content"
        className="p-4 bg-white rounded shadow"
      >
        <h1 className="text-xl font-bold mb-2">Reporte de Productos</h1>
        <p>Este es un ejemplo de contenido exportable.</p>
        {/* Aquí puedes renderizar tus tablas dinámicas, como productos más y menos vendidos */}
      </div>

      <button
        onClick={handleDownloadPDF}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Exportar a PDF
      </button>
    </div>
  );
};

export default ExportPDF;
