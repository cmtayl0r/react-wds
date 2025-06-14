import styles from "./recursive.module.css";

/*
-  ✅ Root array (most common)
- [{id: 1, name: 'Item', children: [...]}]

- ✅ Root object with children
- {id: 1, name: 'Root', children: [...]}
*/

const CommentNode = ({ data, level = 0 }) => {
  // Handle array of items
  if (Array.isArray(data)) {
    return (
      <ul className={styles["tree-list"]} role={level === 0 ? "tree" : "group"}>
        {data.map((item) => (
          <CommentNode key={item.id} data={item} level={level} />
        ))}
      </ul>
    );
  }

  //  Handle single object with children
  const hasReplies = data.replies && data.replies.length > 0;

  return (
    <li
      className="tree-item"
      role="treeitem"
      aria-expanded={hasReplies ? undefined : null}
    >
      {hasReplies ? (
        <details className={styles["item-details"]}>
          <summary className={styles["item-summary"]}>
            <span aria-hidden="true">{level === 0 ? "💁‍♀️" : "💬"}</span>
            <span className={styles["comment-author"]}>{data.author}</span>
            <span className={styles["comment-text"]}>{data.text}</span>
            <span
              className="item-count"
              aria-label={`${data.replies.length} items`}
            >
              ({data.replies.length})
            </span>
          </summary>
          <CommentNode data={data.replies} level={level + 1} />
        </details>
      ) : (
        <div className={styles["item-summary"]}>
          <span aria-hidden="true">💬</span>
          <span className={styles["comment-author"]}>{data.author}</span>
          <span className={styles["comment-text"]}>{data.text}</span>
        </div>
      )}
    </li>
  );
};

export default CommentNode;
