import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(200);
  const [yearlyReturn, setYearlyReturn] = useState(10);
  const [initialAmount, setInitialAmount] = useState(0);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [milestones, setMilestones] = useState({
    fiveYears: 0,
    tenYears: 0,
    twentyYears: 0,
    totalInvested: 0,
    totalRevenue: 0
  });

  const calculateInvestmentGrowth = () => {
    const monthlyRate = yearlyReturn / 100 / 12;
    const months = 240; // 20 years
    let balance = initialAmount;
    const balances = [balance];
    const totalInvested = initialAmount + (monthlyInvestment * months);

    for (let i = 1; i <= months; i++) {
      balance = (balance + monthlyInvestment) * (1 + monthlyRate);
      balances.push(balance);
    }

    setMilestones({
      fiveYears: balances[60].toFixed(2),
      tenYears: balances[120].toFixed(2),
      twentyYears: balances[240].toFixed(2),
      totalInvested: totalInvested.toFixed(2),
      totalRevenue: (balances[240] - totalInvested).toFixed(2)
    });

    return balances;
  };

  const updateChart = () => {
    const balances = calculateInvestmentGrowth();
    const years = Array.from({ length: 21 }, (_, i) => `Year ${i}`);
    const yearlyBalances = balances.filter((_, i) => i % 12 === 0);

    setChartData({
      labels: years,
      datasets: [
        {
          label: 'Investment Growth',
          data: yearlyBalances,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }
      ]
    });
  };

  useEffect(() => {
    updateChart();
  }, [monthlyInvestment, yearlyReturn, initialAmount]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const handleMonthlyInvestmentChange = (e) => {
    const value = Number(e.target.value);
    if (value >= 0) {
      setMonthlyInvestment(value);
    }
  };

  return (
    <div className="container">
      <h1>Investment Calculator</h1>
      
      <div className="form-container">
        <div className="form-group">
          <label>Monthly Investment:</label>
          <input
            type="number"
            min="0"
            value={monthlyInvestment}
            onChange={handleMonthlyInvestmentChange}
          />
        </div>

        <div className="form-group">
          <label>Yearly Return (%):</label>
          <input
            type="number"
            value={yearlyReturn}
            onChange={(e) => setYearlyReturn(Number(e.target.value))}
          />
        </div>

        <div className="form-group">
          <label>Initial Amount:</label>
          <input
            type="number"
            min="0"
            value={initialAmount}
            onChange={(e) => setInitialAmount(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="results-container">
        <div className="milestones">
          <h2>Investment Milestones</h2>
          <div className="milestone">
            <strong>5 Years:</strong> {formatCurrency(milestones.fiveYears)}
          </div>
          <div className="milestone">
            <strong>10 Years:</strong> {formatCurrency(milestones.tenYears)}
          </div>
          <div className="milestone">
            <strong>20 Years:</strong> {formatCurrency(milestones.twentyYears)}
          </div>
        </div>

        <div className="milestones">
          <h2>Investment Summary</h2>
          <div className="milestone">
            <strong>Total Invested:</strong> {formatCurrency(milestones.totalInvested)}
          </div>
          <div className="milestone">
            <strong>Total Revenue:</strong> {formatCurrency(milestones.totalRevenue)}
          </div>
        </div>
      </div>

      <div className="chart-container">
        <Line 
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Investment Growth Over Time'
              }
            },
            scales: {
              y: {
                ticks: {
                  callback: (value) => formatCurrency(value)
                }
              }
            }
          }}
        />
      </div>
    </div>
  );
}

export default App;
