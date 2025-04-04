import useLocalStorage from "../../../hooks/useLocalStorage";

function LocalStorage() {
  const [firstName, setFirstName, removeFirstName] = useLocalStorage(
    "FIRST_NAME",
    ""
  );
  const [lastName, setLastName, removeLastName] = useLocalStorage(
    "LAST_NAME",
    () => {
      return "Default";
    }
  );
  const [hobbies, setHobbies, removeHobbies] = useLocalStorage("HOBBIES", [
    "Programming",
    "Weight Lifting",
  ]);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          marginBottom: "1rem",
        }}
      >
        <label>First Name</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <button onClick={() => removeFirstName()}>Clear vorname</button>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          marginBottom: "1rem",
        }}
      >
        <label>Last Name</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <button onClick={() => removeLastName()}>Clear nachname</button>
      </div>
      <div>{hobbies.join(", ")}</div>
      <button
        onClick={() =>
          setHobbies((currentHobbies) => [...currentHobbies, "New Hobby"])
        }
      >
        Add Hobby
      </button>
      <button onClick={() => removeHobbies()}>Reset Hobbies</button>
    </>
  );
}

export default LocalStorage;
