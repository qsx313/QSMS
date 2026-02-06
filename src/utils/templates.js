export const BLOCK_TYPES = {
  title1: {
    id: "title1",
    label: "一级标题",
    description: "用于章节标题，如 8 安全教育培训",
    placeholder: "请输入一级标题",
    rows: 2,
    style: {
      fontSize: 16,
      bold: true,
      alignment: "center",
      spacingAfter: 10
    }
  },
  title2: {
    id: "title2",
    label: "二级标题",
    description: "用于小节标题，如 8.5 安全教育培训管理",
    placeholder: "请输入二级标题",
    rows: 2,
    style: {
      fontSize: 14,
      bold: true,
      alignment: "left",
      spacingAfter: 8,
      indentLeft: 240
    }
  },
  body: {
    id: "body",
    label: "正文",
    description: "正文段落，支持序号与缩进",
    placeholder: "请输入正文内容",
    rows: 4,
    style: {
      fontSize: 12,
      alignment: "left",
      spacingAfter: 6,
      indentFirstLine: 420
    }
  },
  list: {
    id: "list",
    label: "条款/序号",
    description: "用于 1)、2) 等条款",
    placeholder: "例如：1) 安全培训应记录",
    rows: 3,
    style: {
      fontSize: 12,
      alignment: "left",
      spacingAfter: 6,
      indentLeft: 420
    }
  },
  table: {
    id: "table",
    label: "基础表格",
    description: "版本/修订/编制信息表",
    placeholder: "请输入表格内容",
    rows: 4,
    style: {
      fontSize: 11,
      alignment: "center",
      spacingAfter: 8
    }
  }
};

export const createBlock = (type, id) => {
  const template = BLOCK_TYPES[type];
  return {
    id,
    type,
    content: template?.placeholder ?? "",
    notes: template?.description ?? "",
    style: template?.style ?? {}
  };
};

export const createDefaultDocument = () => ({
  title: "安全教育培训管理",
  header: "SHZATW/QSMS-JB/2D-ZH-8.5",
  footer: "运行保障室",
  blocks: [
    createBlock("title1", "title1"),
    createBlock("title2", "title2"),
    createBlock("table", "table"),
    createBlock("body", "body-1"),
    createBlock("list", "list-1")
  ]
});
