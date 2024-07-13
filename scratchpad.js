async function fetchData() {
    console.log("Fetching data...");
    
    const data = await new Promise((resolve) => {
      setTimeout(() => {
        resolve("Data received");
      }, 2000); // Simulates a 2-second network request
    });
  
    console.log(data);
    console.log("Finished fetching data");
  }
  
  fetchData();
  console.log("This line runs immediately after fetchData is called");
  