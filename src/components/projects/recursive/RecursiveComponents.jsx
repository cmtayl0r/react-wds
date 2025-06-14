import styles from "./recursive.module.css";
import TreeNode from "./TreeNode";
import CommentNode from "./CommentNode";
import {
  simpleTreeData,
  fileSystemData,
  commentsData,
  navigationData,
} from "./recursiveData";
import NavigationNode from "./NavigationNode";

const RecursiveComponents = () => {
  return (
    <div className={styles["recursive-container"]}>
      {/* Example 1 */}
      <section>
        <h5>Simple Tree Data</h5>
        <TreeNode data={simpleTreeData} />
      </section>
      {/* Example 2 🗂️ File System Structure  */}
      <section>
        <h5>File System Structure</h5>
        <TreeNode data={fileSystemData.children} />
        {/* {Object.values(fileSystemData).map((item, idx) => (
          <FileSystem key={item.id || idx} item={item} />
        ))} */}
      </section>
      {/* Example 3 💬 Comments Thread */}
      <section>
        <h5>Comments Thread</h5>
        <CommentNode data={commentsData} />
      </section>
      {/* Example 4 🧭 Navigation Menu*/}
      <section>
        <h5>Navigation Menu</h5>
        <NavigationNode data={navigationData} />
      </section>
    </div>
  );
};

export default RecursiveComponents;
