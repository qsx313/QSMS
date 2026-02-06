import React, { useMemo, useState } from "react";
import { nanoid } from "nanoid";
import Toolbar from "./components/Toolbar.jsx";
import Editor from "./components/Editor.jsx";
import { BLOCK_TYPES, createBlock, createDefaultDocument } from "./utils/templates.js";
import { exportToDocx } from "./utils/exportDocx.js";
import { exportToPdf } from "./utils/exportPdf.js";

const STORAGE_KEY = "qsms-manual-document-v1";

const loadFromStorage = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return createDefaultDocument();
  }
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.blocks)) {
      return createDefaultDocument();
    }
    return parsed;
  } catch (error) {
    console.warn("Failed to parse saved document", error);
    return createDefaultDocument();
  }
};

export default function App() {
  const [document, setDocument] = useState(loadFromStorage);
  const [status, setStatus] = useState("未保存");

  const blockTypeOptions = useMemo(() => Object.values(BLOCK_TYPES), []);

  const updateBlock = (id, updates) => {
    setDocument((prev) => ({
      ...prev,
      blocks: prev.blocks.map((block) =>
        block.id === id ? { ...block, ...updates } : block
      )
    }));
  };

  const addBlock = (type) => {
    const newBlock = createBlock(type, nanoid());
    setDocument((prev) => ({
      ...prev,
      blocks: [...prev.blocks, newBlock]
    }));
  };

  const reorderBlocks = (sourceIndex, targetIndex) => {
    setDocument((prev) => {
      const nextBlocks = [...prev.blocks];
      const [moved] = nextBlocks.splice(sourceIndex, 1);
      nextBlocks.splice(targetIndex, 0, moved);
      return { ...prev, blocks: nextBlocks };
    });
  };

  const removeBlock = (id) => {
    setDocument((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((block) => block.id !== id)
    }));
  };

  const saveToStorage = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(document));
    setStatus(`已保存 ${new Date().toLocaleString()}`);
  };

  const handleExportDocx = async () => {
    setStatus("正在导出 Word...");
    try {
      await exportToDocx(document);
      setStatus("Word 导出完成");
    } catch (error) {
      console.error(error);
      setStatus("Word 导出失败");
    }
  };

  const handleExportPdf = async () => {
    setStatus("正在导出 PDF...");
    try {
      await exportToPdf(document);
      setStatus("PDF 导出完成");
    } catch (error) {
      console.error(error);
      setStatus("PDF 导出失败");
    }
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>QSMS 手册编辑器</h1>
          <p>拖动标题/正文到编辑区，自动套用格式规范。</p>
        </div>
        <div className="header-actions">
          <button type="button" onClick={saveToStorage}>
            保存
          </button>
          <button type="button" onClick={handleExportDocx}>
            导出 Word
          </button>
          <button type="button" onClick={handleExportPdf}>
            导出 PDF
          </button>
        </div>
      </header>

      <main className="app-main">
        <Toolbar blockTypes={blockTypeOptions} onAdd={addBlock} />
        <Editor
          blocks={document.blocks}
          onUpdate={updateBlock}
          onRemove={removeBlock}
          onReorder={reorderBlocks}
          onAdd={addBlock}
        />
      </main>

      <footer className="app-footer">{status}</footer>
    </div>
  );
}
