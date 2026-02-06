import React, { useMemo, useState } from "react";
import { BLOCK_TYPES } from "../utils/templates.js";

export default function Editor({
  blocks,
  onUpdate,
  onRemove,
  onReorder,
  onAdd
}) {
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const typeMap = useMemo(
    () =>
      Object.values(BLOCK_TYPES).reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {}),
    []
  );

  const handleDrop = (event) => {
    event.preventDefault();
    const type = event.dataTransfer.getData("application/x-block-type");
    if (type) {
      onAdd(type);
    }
  };

  const handleDropOnList = (event) => {
    event.preventDefault();
    const type = event.dataTransfer.getData("application/x-block-type");
    if (type) {
      onAdd(type);
    }
  };

  const handleDragStart = (event, index) => {
    event.dataTransfer.setData("text/plain", String(index));
  };

  const handleDragOver = (event, index) => {
    event.preventDefault();
    setDragOverIndex(index);
  };

  const handleDropReorder = (event, index) => {
    event.preventDefault();
    const sourceIndex = Number(event.dataTransfer.getData("text/plain"));
    if (!Number.isNaN(sourceIndex) && sourceIndex !== index) {
      onReorder(sourceIndex, index);
    }
    setDragOverIndex(null);
  };

  return (
    <section className="editor">
      <div className="editor-header">
        <h2>手册编辑区</h2>
        <span>双击或直接输入文本以编辑内容</span>
      </div>

      <div
        className="editor-canvas"
        onDrop={handleDropOnList}
        onDragOver={(event) => event.preventDefault()}
      >
        {blocks.map((block, index) => {
          const type = typeMap[block.type];
          return (
            <div
              key={block.id}
              className={`editor-block ${dragOverIndex === index ? "drag-over" : ""}`}
              draggable
              onDragStart={(event) => handleDragStart(event, index)}
              onDragOver={(event) => handleDragOver(event, index)}
              onDrop={(event) => handleDropReorder(event, index)}
            >
              <div className="block-meta">
                <span className="block-type">{type?.label ?? "未知"}</span>
                <button type="button" onClick={() => onRemove(block.id)}>
                  删除
                </button>
              </div>
              {block.type === "table" ? (
                <textarea
                  value={block.content}
                  onChange={(event) =>
                    onUpdate(block.id, { content: event.target.value })
                  }
                  rows={4}
                  placeholder="示例：版本号 | 修订号 | 编制 | 审核 | 批准 | 生效日期"
                />
              ) : (
                <textarea
                  value={block.content}
                  onChange={(event) =>
                    onUpdate(block.id, { content: event.target.value })
                  }
                  placeholder={type?.placeholder}
                  rows={type?.rows ?? 3}
                />
              )}
              {block.notes ? <p className="block-notes">{block.notes}</p> : null}
            </div>
          );
        })}
        <div className="editor-dropzone" onDrop={handleDrop} onDragOver={(event) => event.preventDefault()}>
          拖动元素到这里新增内容
        </div>
      </div>
    </section>
  );
}
