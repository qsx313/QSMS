import React from "react";

export default function Toolbar({ blockTypes, onAdd }) {
  const handleDragStart = (event, type) => {
    event.dataTransfer.setData("application/x-block-type", type);
  };

  return (
    <aside className="toolbar">
      <h2>元素库</h2>
      <p>拖动到右侧编辑区</p>
      <div className="toolbar-list">
        {blockTypes.map((item) => (
          <button
            type="button"
            key={item.id}
            className="toolbar-item"
            onClick={() => onAdd(item.id)}
            draggable
            onDragStart={(event) => handleDragStart(event, item.id)}
          >
            <span className="item-title">{item.label}</span>
            <span className="item-desc">{item.description}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
