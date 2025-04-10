export default function InfoSections() {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section id="about" className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">
            About the Knapsack Problem
          </h2>
          <div className="glass p-6 rounded-lg">
            <p className="mb-4">
              The 0/1 Knapsack problem is a classic optimization problem in computer science and mathematics.
              Given a set of items, each with a weight and a value, the goal is to select items to include
              in a knapsack such that:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>The total weight does not exceed the knapsack's capacity.</li>
              <li>The total value is maximized.</li>
            </ul>
            <p className="mb-4">
              In the 0/1 variant, you can either take an item completely (1) or leave it (0).
              You cannot take a fraction of an item, which distinguishes it from the fractional knapsack problem.
            </p>
            <p>
              This simulator demonstrates the dynamic programming approach to solving the 0/1 Knapsack problem,
              visualizing how the algorithm builds up the optimal solution through a table-based approach.
            </p>
          </div>
        </section>

        <section id="howto" className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">
            How to Use This Simulator
          </h2>
          <div className="glass p-6 rounded-lg">
            <ol className="list-decimal pl-6 space-y-4">
              <li>
                <strong className="text-secondary-300">Add items</strong> - Use the form to add items with specific weights and values,
                or generate random items using the buttons.
              </li>
              <li>
                <strong className="text-secondary-300">Set knapsack capacity</strong> - Adjust the maximum weight the knapsack can hold.
              </li>
              <li>
                <strong className="text-secondary-300">Solve the problem</strong> - Click "Solve Knapsack" to run the algorithm.
              </li>
              <li>
                <strong className="text-secondary-300">Explore the solution</strong> - View the 3D visualization of items in/out of the knapsack,
                and examine the dynamic programming table.
              </li>
              <li>
                <strong className="text-secondary-300">Animate the algorithm</strong> - Step through the algorithm's execution or play an animation
                to see how the solution is built step by step.
              </li>
            </ol>
          </div>
        </section>

        <section id="theory" className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">
            Dynamic Programming Theory
          </h2>
          <div className="glass p-6 rounded-lg">
            <h3 className="text-xl font-medium mb-4 text-primary-300">The Approach</h3>
            <p className="mb-4">
              Dynamic programming solves the Knapsack problem by breaking it down into smaller subproblems
              and building up the solution incrementally. We create a table where:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Rows represent the items we're considering (from 0 to n items)</li>
              <li>Columns represent the knapsack capacity (from 0 to W capacity)</li>
              <li>Each cell DP[i][w] represents the maximum value achievable using the first i items with capacity w</li>
            </ul>

            <h3 className="text-xl font-medium mb-4 text-primary-300">The Recurrence Relation</h3>
            <div className="p-4 bg-gray-800 rounded-lg mb-6 overflow-x-auto">
              <pre className="text-sm">
                DP[i][w] = max(DP[i-1][w], DP[i-1][w - weight[i]] + value[i])
                if weight[i] ≤ w

                DP[i][w] = DP[i-1][w]
                           if weight[i] > w
              </pre>
            </div>

            <p className="mb-4">
              Where:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>DP[i-1][w] represents the value without including the current item</li>
              <li>DP[i-1][w - weight[i]] + value[i] represents the value including the current item</li>
            </ul>

            <h3 className="text-xl font-medium mb-4 text-primary-300">Time and Space Complexity</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Time Complexity:</strong> O(n × W) where n is the number of items and W is the knapsack capacity</li>
              <li><strong>Space Complexity:</strong> O(n × W) for storing the DP table</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
