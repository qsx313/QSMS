import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun
} from "docx";

const getAlignment = (alignment) => {
  switch (alignment) {
    case "center":
      return AlignmentType.CENTER;
    case "right":
      return AlignmentType.RIGHT;
    default:
      return AlignmentType.LEFT;
  }
};

const buildParagraph = (block) => {
  const style = block.style ?? {};
  const runs = [
    new TextRun({
      text: block.content || "",
      size: style.fontSize ? style.fontSize * 2 : 24,
      bold: style.bold ?? false
    })
  ];

  const paragraphOptions = {
    children: runs,
    alignment: getAlignment(style.alignment),
    spacing: {
      after: style.spacingAfter ? style.spacingAfter * 20 : 80
    },
    indent: {
      firstLine: style.indentFirstLine ?? 0,
      left: style.indentLeft ?? 0
    }
  };

  if (block.type === "title1") {
    paragraphOptions.heading = HeadingLevel.HEADING_1;
  }

  if (block.type === "title2") {
    paragraphOptions.heading = HeadingLevel.HEADING_2;
  }

  return new Paragraph(paragraphOptions);
};

const buildTable = (block) => {
  const rows = (block.content || "")
    .split("\n")
    .filter(Boolean)
    .map((line) => line.split("|").map((cell) => cell.trim()));

  if (rows.length === 0) {
    rows.push(["版本号", "修订号", "编制", "审核", "批准", "生效日期"]);
  }

  return new Table({
    rows: rows.map(
      (cells) =>
        new TableRow({
          children: cells.map(
            (cell) =>
              new TableCell({
                children: [new Paragraph({ text: cell, alignment: AlignmentType.CENTER })]
              })
          )
        })
    )
  });
};

export const exportToDocx = async (documentData) => {
  const paragraphs = documentData.blocks.map((block) => {
    if (block.type === "table") {
      return buildTable(block);
    }
    return buildParagraph(block);
  });

  const doc = new Document({
    sections: [
      {
        children: paragraphs
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${documentData.title || "QSMS"}.docx`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
