import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export const exportToPDF = async (elementId: string, filename: string = 'resume.pdf') => {
    const element = document.getElementById(elementId)
    if (!element) return

    // Temporarily adjusting for high-quality capture
    const originalStyle = element.style.cssText
    element.style.width = '210mm' // A4 width
    element.style.height = '297mm' // A4 height
    element.style.boxShadow = 'none'

    try {
        const canvas = await html2canvas(element, {
            scale: 2, // Higher scale for better quality
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        })

        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        })

        const imgProps = pdf.getImageProperties(imgData)
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
        pdf.save(filename)
    } catch (error) {
        console.error('Failed to export PDF:', error)
    } finally {
        element.style.cssText = originalStyle
    }
}
