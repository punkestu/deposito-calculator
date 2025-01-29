import { useEffect, useRef, useState } from "react";

const Rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 3,
});

const RupiahWithoutSymbol = new Intl.NumberFormat("id-ID", {
  style: "decimal",
});

const RupiahToNumber = (value: string) => {
  return value.replace(/[^0-9]/g, "");
};

const calculateProfit = (
  deposit: number,
  tenorMonth: number,
  interestRate: number,
  timeDepositMonth: number,
  taxRate: number
) => {
  let result = deposit;
  let interestTenor = interestRate * tenorMonth;
  let holdTime = Math.floor(timeDepositMonth / tenorMonth);

  for (let i = 0; i < holdTime; i++) {
    const profit = result * (interestTenor / 100);
    const tax = profit * (taxRate / 100);
    result += profit - (tax > 0 ? tax : 0);
  }

  return result;
};

function App() {
  const [deposit, setDeposit] = useState(0);
  const [depositComma, setDepositComma] = useState(0);
  const [result, setResult] = useState(0);
  const [profit, setProfit] = useState(0);

  const [tenor, setTenor] = useState(0);
  const [tenorType, setTenorType] = useState("month");
  const [interest, setInterest] = useState(0.0);
  const [interestType, setInterestType] = useState("pa");
  const [timeDeposit, setTimeDeposit] = useState(0);
  const [timeDepositType, setTimeDepositType] = useState("month");
  const [taxRate, setTaxRate] = useState(0);

  const widthCalc = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (deposit > 0 && tenor > 0 && interest > 0 && timeDeposit > 0) {
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

      const newResult = calculateProfit(
        parseFloat(deposit.toString() + "." + depositComma.toString()),
        tenorMonth,
        interestRate,
        timeDepositMonth,
        taxRate
      );
      setResult(newResult);
      setProfit(
        newResult -
          parseFloat(deposit.toString() + "." + depositComma.toString())
      );
    } else {
      setResult(parseFloat(deposit.toString() + "." + depositComma.toString()));
    }
  }, [
    tenor,
    interest,
    timeDeposit,
    deposit,
    depositComma,
    tenorType,
    interestType,
    timeDepositType,
    taxRate,
  ]);

  function handleDepositChange(e: HTMLInputElement) {
    widthCalc.current!.innerText = e.value.length > 0 ? e.value : "0";
    e.style.width = widthCalc.current!.offsetWidth + "px";
  }
  return (
    <main className="flex w-screen h-screen items-center justify-center bg-slate-100">
      <div className="flex flex-col p-4 rounded-md bg-white w-[90vw] md:w-[50vw]">
        <span
          className="self-start absolute opacity-0 px-3 py-1"
          ref={widthCalc}
        ></span>
        <h1 className="text-center text-2xl font-bold">
          Lets calculate your profit
        </h1>
        <hr className="my-2" />
        <label>
          <p className="text-lg font-semibold">Deposit</p>
          Rp.&nbsp;
          <input
            type="text"
            className="max-w-[40%] px-2 py-1 w-[5rem]"
            value={deposit > 0 ? RupiahWithoutSymbol.format(deposit) : ""}
            onChange={(e) => {
              handleDepositChange(e.target);
              const rupiahNum =
                e.target.value.length > 0
                  ? RupiahToNumber(e.target.value)
                  : "0";
              setDeposit(rupiahNum.length > 0 ? parseFloat(rupiahNum) : 0);
            }}
            placeholder="0"
          />
          &nbsp;, &nbsp;
          <input
            type="number"
            step={0}
            className="px-2 py-1 w-[20%]"
            value={depositComma > 0 ? depositComma : ""}
            max={999}
            onChange={(e) =>
              setDepositComma(
                e.target.value.length > 0 ? parseInt(e.target.value) : 0
              )
            }
            placeholder="0"
          />
        </label>
        <label>
          <p className="text-lg font-semibold">Tenor</p>
          <div className="flex">
            <select
              value={tenorType}
              className="px-2 py-1 w-[30%]"
              onChange={(e) => setTenorType(e.target.value)}
            >
              <option value="month">Month(s)</option>
              <option value="year">Year(s)</option>
            </select>
            &nbsp;
            <input
              type="number"
              className="px-2 py-1 flex-grow"
              value={tenor > 0 ? tenor : ""}
              onChange={(e) =>
                setTenor(
                  e.target.value.length > 0 ? parseInt(e.target.value) : 0
                )
              }
              placeholder="0"
            />
          </div>
        </label>
        <label>
          <p className="text-lg font-semibold">Interest Rate</p>
          <div className="flex items-center">
            <select
              value={interestType}
              className="px-2 py-1 w-[30%]"
              onChange={(e) => setInterestType(e.target.value)}
            >
              <option value="pa">p.a</option>
            </select>
            &nbsp;
            <input
              type="number"
              className="px-2 py-1 flex-grow"
              step={0.01}
              value={interest > 0 ? interest : ""}
              onChange={(e) =>
                setInterest(
                  e.target.value.length > 0 ? parseFloat(e.target.value) : 0
                )
              }
              placeholder="0.0"
            />
            &nbsp;%
          </div>
        </label>
        <label>
          <p className="text-lg font-semibold">Hold Time Deposit</p>
          <div className="flex">
            <select
              value={timeDepositType}
              className="px-2 py-1 w-[30%]"
              onChange={(e) => setTimeDepositType(e.target.value)}
            >
              <option value="month">Month(s)</option>
              <option value="year">Year(s)</option>
            </select>
            &nbsp;
            <input
              type="number"
              className="px-2 py-1 flex-grow"
              value={timeDeposit > 0 ? timeDeposit : ""}
              onChange={(e) =>
                setTimeDeposit(
                  e.target.value.length > 0 ? parseInt(e.target.value) : 0
                )
              }
              placeholder="0"
            />
          </div>
        </label>
        <label>
          <p className="text-lg font-semibold">Tax Rate</p>
          <div className="flex">
            <input
              type="number"
              className="px-2 py-1 flex-grow"
              value={taxRate > 0 ? taxRate : ""}
              onChange={(e) =>
                setTaxRate(
                  e.target.value.length > 0 ? parseInt(e.target.value) : 0
                )
              }
              placeholder="0"
            />
            &nbsp;%
          </div>
        </label>
        <p className="text-lg font-semibold">Result</p>
        <div className="overflow-x-auto overflow-y-hidden">
          <p className="text-4xl font-black text-nowrap">
            {Rupiah.format(result >= 0 ? result : -result)
              .replace("Rp", result >= 0 ? "Rp " : "Rp -")
              .replace(String.fromCharCode(160), "")}
          </p>
        </div>
        <p
          className={`mt-2 ${
            profit == 0
              ? "hidden"
              : profit > 0
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {Rupiah.format(profit)}
        </p>
      </div>
    </main>
  );
}

export default App;
