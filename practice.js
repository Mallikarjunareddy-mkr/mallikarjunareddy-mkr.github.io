// 1️⃣ Static HTML
body(`
  <header>Header Section</header>
  <div id="app"></div>
  <footer>Footer Section</footer>
`);

// 2️⃣ Static CSS
css(`
  body { font-family: Arial, sans-serif; margin:0; padding:0; }
  header, footer { background:#333; color:white; padding:10px; text-align:center; }
  #app input { display:block; margin:10px 0; padding:5px 10px; width:300px; font-size:16px; }
  #addBtn {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #007BFF;
    color: white;
    font-size: 24px;
    border: none;
    cursor: pointer;
  }
`);

// 3️⃣ Dynamic JS
$("<button id='addBtn'>+</button>");

// Click event to add input boxes
$("#addBtn").Addevent({
  click: () => {
    $("#app").Child("<input>");
  }
});
