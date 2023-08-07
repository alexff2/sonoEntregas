import React from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

import Modal from '../Modal'

import './report.css'

export default function Reports({children, save, openModal, setOpenModal}){
  const generatePDF  = async () => {
    const elementos = document.querySelectorAll('.report')
    const numPaginas = elementos.length
    const promises = []

    const options = {
      background: 'white',
      scale: 3,
      useCORS: true
    }

    for (let i = 0; i < numPaginas; i++) {
      const elemento = elementos[i]
      const promise = html2canvas(elemento, options).then(canvas => {
        const imagem = canvas.toDataURL('image/png')
        return {
          imagem,
          altura: canvas.height,
          largura: canvas.width,
        }
      })

      promises.push(promise)
    }

    const paginas = await Promise.all(promises)

    const pdf = new jsPDF('p', 'pt', 'a4')

    for (let i = 0; i < numPaginas; i++) {
      const pagina = paginas[i]
      const altura = pagina.altura * 595 / pagina.largura

      pdf.addImage(pagina.imagem, 'PNG', 0, 0, 595, altura, undefined, 'FAST')

      if (i < numPaginas - 1) {
        pdf.addPage()
      }
    }

    pdf.save(`${save}.pdf`)
  }

  return(
    <Modal
      open={openModal}
      setOpen={setOpenModal}
    >
      <div className='modalReport'>
        <div className="headerReport">
          <span>{save}</span>
          <button onClick={generatePDF}>Gerar PDF</button>
        </div>

        {children}
      </div>
    </Modal>
  )
}