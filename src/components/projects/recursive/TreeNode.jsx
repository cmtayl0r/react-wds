import styles from "./recursive.module.css";

/*
-  ✅ Root array (most common)
- [{id: 1, name: 'Item', children: [...]}]

- ✅ Root object with children
- {id: 1, name: 'Root', children: [...]}
*/

const TreeNode = ({ data, level = 0 }) => {
  // 🔍 RECURSION ENTRY POINT: Check what type of data we received
  // This determines which "path" the recursion takes

  // 📋 PATH 1: ARRAY HANDLING
  if (Array.isArray(data)) {
    // We received an array of items (like [{}, {}, {}])
    // Create a <ul> container and recursively call TreeNode for each item
    return (
      <ul className={styles["tree-list"]} role={level === 0 ? "tree" : "group"}>
        {data.map((item) => (
          // 🔄 RECURSIVE CALL #1: Each array item becomes a new TreeNode
          // This time we're passing an OBJECT (not array) so it will go to PATH 2
          <TreeNode
            key={item.id}
            data={item} // ← Single object from the array
            level={level} // ← Keep same level (we're just distributing items)
          />
        ))}
      </ul>
    );
  }

  // 📄 PATH 2: OBJECT HANDLING
  // If we reach here, data is a single object like {id: 1, name: 'folder', children: [...]}
  const hasChildren = data.children && data.children.length > 0;

  return (
    <li
      className="tree-item"
      role="treeitem"
      aria-expanded={hasChildren ? undefined : null}
    >
      {hasChildren ? (
        // 🌳 BRANCH NODE: This object has children, so create expandable details
        <details className={styles["item-details"]}>
          <summary className={styles["item-summary"]}>
            <span aria-hidden="true">{level === 0 ? "🗂️" : "📁"}</span>
            <span>{data.name}</span>
            <span
              className="item-count"
              aria-label={`${data.children.length} items`}
            >
              ({data.children.length})
            </span>
          </summary>

          {/* 🔄 RECURSIVE CALL #2: Pass children array back to TreeNode */}
          {/* This creates the "deeper level" of the tree */}
          <TreeNode
            data={data.children} // ← Array of child objects
            level={level + 1} // ← Increment level (we're going deeper)
          />
          {/* ↑ This call will go to PATH 1 (array handling) because data.children is an array */}
        </details>
      ) : (
        // 🍃 LEAF NODE: This object has no children, so just display it
        // This is a "BASE CASE" - recursion stops here for this branch
        <div className={styles["item-summary"]}>
          <span aria-hidden="true">📄</span>
          <span>{data.name}</span>
        </div>
      )}
    </li>
  );
};

export default TreeNode;
