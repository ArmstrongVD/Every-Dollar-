window.onload = function () {
  let chartInstance; // Store the chart instance
  const ctx = document.getElementById('barChart').getContext('2d');
  const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

  function showToast(message, type) {
    const toastElement = document.getElementById('toastMessage');
    const toastTitle = document.getElementById('toastTitle');
    const toastBody = document.getElementById('toastBody');

    // Customize the toast based on the type
    if (type === 'success') {
      toastElement.classList.remove('bg-danger', 'bg-warning');
      toastElement.classList.add('bg-success');
      toastTitle.textContent = 'Success';
    } else if (type === 'error') {
      toastElement.classList.remove('bg-success', 'bg-warning');
      toastElement.classList.add('bg-danger');
      toastTitle.textContent = 'Error';
    } else if (type === 'warning') {
      toastElement.classList.remove('bg-success', 'bg-danger');
      toastElement.classList.add('bg-warning');
      toastTitle.textContent = 'Warning';
    }

    // Set the message
    toastBody.textContent = message;

    // Show the toast
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
  }
  // input with id "username" onChange event
  document.getElementById('login').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent form submission

    const username = document.getElementById('username').value.trim();
    regex = /^[a-zA-Z0-9]+$/; // Regular expression to allow only alphanumeric characters

    if (!regex.test(username)) {
      // Show toast message for invalid username
      showToast('Please enter a valid username (alphanumeric only).', 'error') &&
      showToasst('This is a warning message', 'warning');

    } else {
      // Show toast message for successful login
      showToast(`Welcome, ${username}!`, 'success');
      // Add further login logic here
    }
    // Clear the input field
    document.getElementById('username').value = '';
  });

  document.getElementById('chart-tab').addEventListener('click', function () {
    // Retrieve the latest income and expense values
    const incomeData = months.map(month => parseFloat(document.getElementById(`income-${month}`).value) || 0);
    const expenseData = months.map(month => parseFloat(document.getElementById(`expenses-${month}`).value) || 0);

    // Destroy the previous chart instance if it exists
    if (chartInstance) {
      chartInstance.destroy();
    }

    // Create a new chart instance
    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: months.map(month => month.charAt(0).toUpperCase() + month.slice(1)),
        datasets: [
          {
            label: 'Income',
            data: incomeData,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          },
          {
            label: 'Expenses',
            data: expenseData,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  });
  document.getElementById('download-csv').addEventListener('click', function () {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Collect data from input fields
    const incomeData = months.map(month => parseFloat(document.getElementById(`income-${month.toLowerCase()}`).value) || 0);
    const expenseData = months.map(month => parseFloat(document.getElementById(`expenses-${month.toLowerCase()}`).value) || 0);

    // Prepare data for the Excel sheet
    const data = [['Month', 'Income', 'Expenses']];
    months.forEach((month, index) => {
      data.push([month, incomeData[index], expenseData[index]]);
    });

    // Add chart data as an image (optional)
    const chartCanvas = document.getElementById('barChart');
    const chartImage = chartCanvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = chartImage;
    downloadLink.download = 'chart.png'; // Specify the file name
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);


    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

    // Add the chart image to the workbook
    const wsImage = XLSX.utils.aoa_to_sheet([['Chart']]);
    XLSX.utils.sheet_add_aoa(wsImage, [['']], { origin: 'B2' });
    XLSX.utils.book_append_sheet(workbook, wsImage, 'Chart');

    // Download the Excel file
    XLSX.writeFile(workbook, 'Bucks2Bar.xlsx');
  });
};
