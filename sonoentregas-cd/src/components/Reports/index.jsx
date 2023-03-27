import React from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

import Modal from '../Modal'

import './report.css'

export default function ReportMaintenance({children, save, openModal, setOpenModal}){
  const generatePDF = ()=>{
    const report = document.querySelector('#report')
    const doc = new jsPDF('p', 'px', 'a4')

    const options = {
      background: 'white',
      scale: 3,
      useCORS: true
    };

    html2canvas(report, options)
      .then( canvas => {

        const img = canvas.toDataURL('image/PNG')

        // Add image Canvas to PDF
        const edgeX = 0
        const edgeY = 0
        const imgProps = doc.getImageProperties(img)
        const width = doc.internal.pageSize.getWidth() - 2 * edgeX
        const height = (imgProps.height * width) / imgProps.width
        console.log(width, height)
        doc.addImage(img, 'PNG', edgeX, edgeY, width, height, undefined, 'FAST')
        return doc
      })
      .then((docResult) => {
        docResult.save(save)
      })
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
        <div id="report">
          {children}
        </div>
      </div>
    </Modal>
  )
}