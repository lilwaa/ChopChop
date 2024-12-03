import React, { useState, useEffect } from 'react';
import { getUserData } from '../../firebase/userService';
import { collection, doc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Registering necessary chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Budget() {
  const [grandTotals, setGrandTotals] = useState([]);
  const [dates, setDates] = useState([]);

  // Fetch receipts and their grand totals
  const fetchGrandTotals = async () => {
    try {
      const userData = await getUserData();
      if (!userData) {
        console.error('User data not found.');
        return;
      }
  
      console.log('User data:', userData);
  
      const userDocRef = doc(db, 'users', userData.uid);
      const crCollectionRef = collection(userDocRef, 'clean-receipts');
      const snapshot = await getDocs(crCollectionRef);
  
      console.log('Fetching receipts from path:', crCollectionRef.path);
  
      // Initialize an object to hold totals by date
      const totalsByDate = {};
  
      // Process each document in the snapshot
      snapshot.docs.forEach((docSnapshot) => {
        const receiptData = docSnapshot.data();
        console.log('Receipt Data:', receiptData);
  
        // Access the grand_total and datetime
        let grandTotal = receiptData?.receiptInfo?.total?.grand_total;
        const datetime = receiptData?.receiptInfo?.transaction?.datetime?.seconds;
  
        // Ensure grandTotal is a number
        if (typeof grandTotal === 'string') {
          grandTotal = parseFloat(grandTotal);  // Convert string to number if needed
        }
  
        // Proceed only if grandTotal and datetime are valid
        if (!isNaN(grandTotal) && datetime) {
          const date = new Date(datetime * 1000).toLocaleDateString(); // Convert seconds to human-readable date
  
          // Log before updating the totalsByDate object
          console.log(`Before update: ${date} - ${totalsByDate[date] || 0}`);
  
          // If the date doesn't exist, initialize it
          if (!totalsByDate[date]) {
            totalsByDate[date] = 0;
          }
  
          // Add grand total to the existing value for this date
          totalsByDate[date] += grandTotal;
  
          // Log the updated totals for the date
          console.log(`After update: ${date} - ${totalsByDate[date]}`);
        } else {
          console.warn(`Invalid grandTotal or datetime for receipt: ${receiptData}`);
        }
      });
  
      // Log the final state of totalsByDate before converting to an array
      console.log('Final totalsByDate:', totalsByDate);
  
      // Convert the object into an array of dates and grand totals
      const totalsArray = [];
      for (const date in totalsByDate) {
        totalsArray.push({
          date,
          grandTotal: totalsByDate[date],
        });
      }
  
      // Sort the totalsArray by date
      totalsArray.sort((a, b) => new Date(a.date) - new Date(b.date));
  
      // Separate the dates and grand totals into their own arrays
      const sortedDates = totalsArray.map(item => item.date);
      const sortedTotals = totalsArray.map(item => item.grandTotal);
  
      setDates(sortedDates);
      setGrandTotals(sortedTotals);
  
      //console.log("Sorted Grand Totals:", sortedTotals);  // Log the sorted grand totals
      //console.log("Sorted Dates:", sortedDates);  // Log the sorted dates
    } catch (error) {
      //console.error('Error fetching receipts:', error);
    }
  };
  

  // Fetch receipts on component mount
  useEffect(() => {
    fetchGrandTotals();
  }, []);

  // Prepare the data for the chart
  const chartData = {
    labels: dates, // Dates for x-axis
    datasets: [
      {
        label: 'Grand Total',
        data: grandTotals, // Grand totals for y-axis
        borderColor: 'rgba(255, 165, 0, 1)',  // Orange color for the line
        backgroundColor: 'rgba(255, 165, 0, 0.2)',  // Light orange for the area under the line
        borderWidth: 2,
        tension: 0.4, // Smooth line curve
      },
    ],
  };

  // Chart options for customization
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,  // Allows for custom height
    plugins: {
      title: {
        display: true,
        text: 'Grand Total Over Time',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
        ticks: {
          maxRotation: 45, // Rotate x-axis labels for better readability
          minRotation: 30,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Cost ($)',
        },
        beginAtZero: true,
      },
    },
    elements: {
      point: {
        radius: 5, // Size of the points on the line
        hoverRadius: 7, // Size of the points on hover
      },
    },
  };

  return (
    <div className="Budget" style={{ height: '400px' }}>  {/* Set the height of the container */}
      <h2>Budget</h2>
      {grandTotals.length > 0 ? (
        <>
          <Line data={chartData} options={chartOptions} height={300} />  {/* Set height of the chart */}
        </>
      ) : (
        <p>No grand totals available.</p>
      )}
    </div>
  );
}

export default Budget;



