import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Document, Page, pdfjs } from "react-pdf";
import { ModalBox, ProductView } from "../common";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

function YourProduct() {
  const [activeItem, setActiveItem] = useState<any>(false);
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);

  let userData = useSelector((state: any) => state?.data?.userData?.user);

  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

  const yourProductJson = userData?.myproducts || [];

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const renderPdfView = () => {
    let windowWidth: any = window?.innerWidth;

    if (windowWidth) {
      windowWidth = windowWidth - 200;
    }
    return (
      <ModalBox open={activeItem} size="100%" title={activeItem.name || activeItem.title || ""} setOpen={setActiveItem}>
        <Document file={activeItem.resourcefileurl} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from(new Array(numPages), (el, index) => (
            <Page key={`page_${index + 1}`} pageNumber={index + 1} width={windowWidth} />
          ))}
        </Document>
        Page {pageNumber} of {numPages}
      </ModalBox>
    );
  };

  return (
    <>
      <div style={{ marginBottom: "20px", fontSize: "30px" }}>Your Product</div>
      <div className="wrapperbox">
        {yourProductJson.map((item: any, index: any) => {
          return (
            <div className="pointer" onClick={() => setActiveItem(item)}>
              <ProductView item={item} key={index} hideExtra />
            </div>
          );
        })}
      </div>
      {renderPdfView()}
    </>
  );
}

export default YourProduct;
