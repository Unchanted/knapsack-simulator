import React, { useEffect, useRef } from "react";
import * as anime from "animejs";

const DPTable = ({ items, capacity, step, solution, setSolution }) => {
  const tableRef = useRef(null);
  const highlightRef = useRef(null);

  useEffect(() => {
    if (items.length === 0) return;

    const n = items.length;
    const w = capacity;

    const dp = Array(n + 1)
      .fill()
      .map(() => Array(w + 1).fill(0));
    const selected = Array(n + 1)
      .fill()
      .map(() => Array(w + 1).fill(false));

    if (step === 0) {
      setSolution({
        ...solution,
        dpTable: dp,
        selectedItems: [],
        maxValue: 0,
        currentHighlight: null,
      });
      return;
    }

    let currentStep = 0;
    let currentCell = null;

    for (let i = 0; i <= n; i++) {
      for (let j = 0; j <= w; j++) {
        currentStep++;

        if (currentStep > step) {
          setSolution({
            ...solution,
            dpTable: dp,
            currentHighlight: currentCell,
            maxValue: dp[n][w],
          });
          return;
        }

        currentCell = { i, j };

        if (i === 0 || j === 0) {
          dp[i][j] = 0;
        } else {
          const itemIndex = i - 1;
          const itemWeight = items[itemIndex].weight;
          const itemValue = items[itemIndex].value;

          if (itemWeight <= j) {
            if (itemValue + dp[i - 1][j - itemWeight] > dp[i - 1][j]) {
              dp[i][j] = itemValue + dp[i - 1][j - itemWeight];
              selected[i][j] = true;
            } else {
              dp[i][j] = dp[i - 1][j];
              selected[i][j] = false;
            }
          } else {
            dp[i][j] = dp[i - 1][j];
            selected[i][j] = false;
          }
        }
      }
    }

    if (step >= (n + 1) * (w + 1)) {
      const selectedItems = [];
      let i = n;
      let j = w;

      while (i > 0 && j > 0) {
        if (selected[i][j]) {
          selectedItems.push({
            ...items[i - 1],
            fraction: 1,
          });
          j -= items[i - 1].weight;
        }
        i--;
      }

      setSolution({
        ...solution,
        dpTable: dp,
        selectedItems,
        maxValue: dp[n][w],
        currentHighlight: null,
      });
    }
  }, [items, capacity, step, setSolution]);

  useEffect(() => {
    if (solution.currentHighlight && highlightRef.current) {
      try {
        if (typeof anime === "function") {
          anime({
            targets: highlightRef.current,
            scale: [1, 1.1, 1],
            backgroundColor: [
              "rgba(139, 92, 246, 0.3)",
              "rgba(139, 92, 246, 0.7)",
              "rgba(139, 92, 246, 0.3)",
            ],
            duration: 800,
            easing: "easeInOutQuad",
          });
        }
      } catch (error) {
        console.error("Animation error:", error);
      }
    }
  }, [solution.currentHighlight]);

  const getTooltipText = (i, j) => {
    if (i === 0 || j === 0) {
      return "Base case: 0 items or 0 capacity means 0 value";
    }

    const itemIndex = i - 1;
    const itemWeight = items[itemIndex].weight;
    const itemValue = items[itemIndex].value;

    if (itemWeight > j) {
      return `Item ${i} (weight ${itemWeight}) exceeds capacity ${j}, cannot include it`;
    }

    const includeValue = itemValue + solution.dpTable[i - 1][j - itemWeight];
    const excludeValue = solution.dpTable[i - 1][j];

    if (includeValue > excludeValue) {
      return `Include item ${i}: max(${includeValue}, ${excludeValue}) = ${includeValue}`;
    } else {
      return `Exclude item ${i}: max(${includeValue}, ${excludeValue}) = ${excludeValue}`;
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-lg text-white/70">
          Add items to start the simulation
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-bold mb-4">
        0/1 Knapsack (Dynamic Programming)
      </h2>

      <div className="overflow-auto flex-1" ref={tableRef}>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 bg-white/20 text-center">
                Weight →<br />
                Item ↓
              </th>
              {Array(capacity + 1)
                .fill()
                .map((_, j) => (
                  <th key={j} className="p-2 bg-white/20 text-center">
                    {j}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {solution.dpTable.map((row, i) => (
              <tr key={i}>
                <th className="p-2 bg-white/20 text-center">
                  {i === 0 ? (
                    "None"
                  ) : (
                    <>
                      Item {i}
                      <br />
                      <span className="text-xs">
                        ({items[i - 1].value}, {items[i - 1].weight})
                      </span>
                    </>
                  )}
                </th>
                {row.map((cell, j) => {
                  const isHighlighted =
                    solution.currentHighlight?.i === i &&
                    solution.currentHighlight?.j === j;
                  return (
                    <td
                      key={j}
                      className={`p-3 text-center relative transition-colors duration-300 ${
                        i === items.length && j === capacity
                          ? "bg-indigo-600/40"
                          : i === 0 || j === 0
                            ? "bg-white/5"
                            : "bg-white/10 hover:bg-white/20"
                      }`}
                      title={getTooltipText(i, j)}
                      ref={isHighlighted ? highlightRef : null}
                    >
                      <span className="font-mono">{cell}</span>
                      {isHighlighted && (
                        <div className="absolute inset-0 bg-indigo-500/30 rounded pointer-events-none z-10"></div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {solution.currentHighlight && (
        <div className="mt-4 p-3 bg-white/20 rounded-lg">
          <p className="text-sm">
            {getTooltipText(
              solution.currentHighlight.i,
              solution.currentHighlight.j,
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default DPTable;
