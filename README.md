# QSMS 手册编辑器

面向科室 QSMS 手册的格式化编辑网站。支持拖动选择标题/正文/表格块，自动套用规范字体字号、缩进、行距，并可一键导出 Word/PDF。

## 功能特性

- 拖拽式编辑：从左侧元素库拖动到编辑区。
- 标题/正文规范化：按模板自动设置字号、加粗、缩进。
- 自动保存：保存到浏览器本地存储，随时继续编辑。
- Word/PDF 导出：根据模板样式生成文档。

> 说明：PDF 导出基于 pdfmake，中文字体需根据医院字体要求替换自定义字体（见下方“自定义字体”）。

## 本地运行

```bash
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

打开浏览器访问 `http://localhost:5173`。

## 项目结构

```
QSMS/
├── index.html                # 应用入口 HTML
├── package.json              # 依赖与脚本
├── vite.config.js            # Vite 配置
└── src/
    ├── App.jsx               # 页面主体与状态管理
    ├── main.jsx              # React 入口
    ├── styles.css            # 全局样式
    ├── components/
    │   ├── Editor.jsx        # 编辑器区域（拖拽、排序、编辑）
    │   └── Toolbar.jsx       # 元素库（标题/正文/表格）
    └── utils/
        ├── exportDocx.js      # Word 导出
        ├── exportPdf.js       # PDF 导出
        └── templates.js       # 模板与样式定义
```

## 自定义字体（PDF）

1. 准备符合手册规范的 TTF 字体。
2. 使用 pdfmake 的字体嵌入方式生成 vfs 字体，并替换 `exportPdf.js` 中的字体配置。
3. 在 `docDefinition` 中设置 `defaultStyle.font`。

## 设计建议

- 在 `templates.js` 中扩展更多标题级别或新增“页眉/页脚”块。
- 若需要强制格式（例如段前段后、首行缩进、行距），在 `templates.js` 中统一维护，导出时复用。
