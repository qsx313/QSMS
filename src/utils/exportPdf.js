import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const mapBlockToPdf = (block) => {
  if (block.type === "table") {
    const rows = (block.content || "")
      .split("\n")
      .filter(Boolean)
      .map((line) => line.split("|").map((cell) => cell.trim()));
    const body = rows.length
      ? rows
      : [["版本号", "修订号", "编制", "审核", "批准", "生效日期"]];

    return {
      table: {
        widths: Array(body[0].length).fill("*"),
        body
      },
      layout: "lightHorizontalLines",
      margin: [0, 6, 0, 10]
    };
  }

  const style = block.style ?? {};
  return {
    text: block.content || "",
    fontSize: style.fontSize || 12,
    bold: style.bold || false,
    alignment: style.alignment || "left",
    margin: [style.indentLeft || 0, 0, 0, style.spacingAfter || 6]
  };
};

export const exportToPdf = async (documentData) => {
  const content = documentData.blocks.map(mapBlockToPdf);
  const docDefinition = {
    info: { title: documentData.title || "QSMS" },
    pageMargins: [40, 60, 40, 60],
    content
  };

  pdfMake.createPdf(docDefinition).download(`${documentData.title || "QSMS"}.pdf`);
};
