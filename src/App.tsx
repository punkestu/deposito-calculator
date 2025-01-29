import { useEffect, useState } from "react";

const Rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
});

function App() {
  const [deposit, setDeposit] = useState(0);
  const [result, setResult] = useState(0);
  const [tenor, setTenor] = useState(0);
  const [tenorType, setTenorType] = useState("month");
  const [interest, setInterest] = useState(0.0);
  const [interestType, setInterestType] = useState("pa");
  const [timeDeposit, setTimeDeposit] = useState(0);
  const [timeDepositType, setTimeDepositType] = useState("month");

  useEffect(() => {
    if (deposit > 0 && tenor > 0 && interest > 0 && timeDeposit > 0) {
      let profit = deposit;
      let tenorMonth = tenor;
      if (tenorType === "year") {
        tenorMonth *= 12;
      }
      let interestRate = interest;
      if (interestType === "pa") {
        interestRate /= 12;
      }
      let timeDepositMonth = timeDeposit;
      if (timeDepositType === "year") {
        timeDepositMonth *= 12;
      }
      let interestTenor = interestRate * tenorMonth;
      let holdTime = Math.floor(timeDepositMonth / tenorMonth);

      for (let i = 0; i < holdTime; i++) {
        profit += profit * (interestTenor / 100);
      }

      setResult(profit);
    } else {
      setResult(0);
    }
  }, [
    tenor,
    interest,
    timeDeposit,
    deposit,
    tenorType,
    interestType,
    timeDepositType,
  ]);
  return (
    <main className="flex flex-col">
      <h1>Lets calculate your deposito profit</h1>
      <label>
        <p>Deposit</p>
        Rp.&nbsp;
        <input
          type="number"
          className="border"
          value={deposit}
          onChange={(e) => setDeposit(parseInt(e.target.value))}
        />
      </label>
      <label>
        <p>Tenor</p>
        <input
          type="number"
          className="border"
          value={tenor > 0 ? tenor : ""}
          onChange={(e) =>
            setTenor(e.target.value.length > 0 ? parseInt(e.target.value) : 0)
          }
        />
        &nbsp;
        <select
          value={tenorType}
          onChange={(e) => setTenorType(e.target.value)}
        >
          <option value="month">Month(s)</option>
          <option value="year">Year(s)</option>
        </select>
      </label>
      <label>
        <p>Interest</p>
        <input
          type="number"
          className="border"
          step={0.01}
          value={interest}
          onChange={(e) => setInterest(parseFloat(e.target.value))}
        />
        &nbsp;%
        <select
          value={interestType}
          onChange={(e) => setInterestType(e.target.value)}
        >
          <option value="pa">p.a</option>
        </select>
      </label>
      <label>
        <p>Hold Time Deposit</p>
        <input
          type="number"
          className="border"
          value={timeDeposit > 0 ? timeDeposit : ""}
          onChange={(e) =>
            setTimeDeposit(
              e.target.value.length > 0 ? parseInt(e.target.value) : 0
            )
          }
        />
        &nbsp;
        <select
          value={timeDepositType}
          onChange={(e) => setTimeDepositType(e.target.value)}
        >
          <option value="month">Month(s)</option>
          <option value="year">Year(s)</option>
        </select>
      </label>
      <p>Result</p>
      <p>{Rupiah.format(result)}</p>
    </main>
  );
}

export default App;
