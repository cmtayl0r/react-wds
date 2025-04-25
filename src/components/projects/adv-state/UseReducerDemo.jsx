import { useReducer } from "react";

const initialState = {
  balance: 0,
  loan: 0,
  isActive: false,
};

const ACTIONS = {
  OPEN_ACCOUNT: "OPEN_ACCOUNT",
  DEPOSIT: "DEPOSIT",
  WITHDRAW: "WITHDRAW",
  REQUEST_LOAN: "REQUEST_LOAN",
  PAY_LOAN: "PAY_LOAN",
  CLOSE_ACCOUNT: "CLOSE_ACCOUNT",
};

function reducer(state, action) {
  // Guard clause: if isActive false AND action different from openAccount, dont allow action just return state
  // if (!state.isActive && action.type !== "openAccount") return state;

  switch (action.type) {
    case ACTIONS.OPEN_ACCOUNT:
      return {
        ...state,
        isActive: true,
        balance: 500,
      };
    case ACTIONS.DEPOSIT:
      return {
        ...state,
        balance: state.balance + action.payload,
      };
    case ACTIONS.WITHDRAW:
      return {
        ...state,
        balance: state.balance - action.payload,
      };
    case ACTIONS.REQUEST_LOAN:
      // Guard clause: If loan > 0, do nothing, return current state
      if (state.loan > 0) return state;
      return {
        ...state,
        loan: action.payload,
        balance: state.balance + action.payload,
      };
    case ACTIONS.PAY_LOAN:
      // Guard clause: balance < loan, do nothing, return current state
      if (state.balance < state.loan) return state;
      return {
        ...state,
        loan: 0,
        balance: state.balance - action.payload,
      };
    case ACTIONS.CLOSE_ACCOUNT:
      // Guard clause: if loan > 0, and balance different than 0, return current state
      if (state.loan > 0 || state.balance !== 0) return state;
      return initialState;
    default:
      throw new Error("unknown");
  }
}

export default function UseReducerDemo() {
  const [
    { balance, loan, isActive }, // Destructure state to get balance, loan and isActive
    dispatch, // dispatch is a function that takes an action and returns a new state
  ] = useReducer(reducer, initialState);

  return (
    <div className="App">
      <h3>useReducer Bank Account</h3>
      <div style={{ display: "flex", gap: "32px", marginBottom: "16px" }}>
        <h5>Account is: {isActive ? "Open" : "Closed"} </h5>
        <h5>Balance: {balance}</h5>
        <h5>Loan: {loan}</h5>
      </div>

      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <button
          onClick={() => {
            dispatch({ type: ACTIONS.OPEN_ACCOUNT });
          }}
          disabled={isActive}
        >
          Open account
        </button>

        <button
          onClick={() => {
            dispatch({ type: ACTIONS.DEPOSIT, payload: 150 });
          }}
          disabled={!isActive}
        >
          Deposit 150
        </button>

        <button
          onClick={() => {
            dispatch({ type: ACTIONS.WITHDRAW, payload: 50 });
          }}
          disabled={!isActive}
        >
          Withdraw 50
        </button>

        <button
          onClick={() => {
            dispatch({ type: ACTIONS.REQUEST_LOAN, payload: 5000 });
          }}
          disabled={!isActive}
        >
          Request a loan of 5000
        </button>

        <button
          onClick={() => {
            dispatch({ type: ACTIONS.PAY_LOAN, payload: 5000 });
          }}
          disabled={!isActive}
        >
          Pay loan
        </button>

        <button
          onClick={() => {
            dispatch({ type: ACTIONS.CLOSE_ACCOUNT });
          }}
          disabled={!isActive}
        >
          Close account
        </button>
      </div>
    </div>
  );
}
