import { CircleUserRound } from "lucide-react";

function ListItem({ name, email, username }) {
  return (
    <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <CircleUserRound />
      <span>
        {name}, {email}, {username}
        {/*  */}
      </span>
    </li>
  );
}

export default ListItem;
