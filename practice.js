<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>MiniJS To-Do</title>
</head>
<body>

  <!-- MiniJS Module -->
  <script src="mod.js"></script>

  <!-- Your website script -->
  <script>
    // 1️⃣ Static HTML
    body(`
      <header>My To-Do List</header>
      <div id="app"></div>
      <footer>© 2025 MiniJS Demo</footer>
    `);

    // 2️⃣ Static CSS
    css(`
      body { font-family: Arial, sans-serif; margin:0; padding:0; background:#f4f4f4; }
      header, footer { background:#333; color:white; padding:15px; text-align:center; }
      #app { padding:20px; }
      .task { 
        background:white; 
        margin:10px 0; 
        padding:10px; 
        border-radius:5px; 
        cursor:pointer; 
        transition:0.2s; 
      }
      .task.completed { text-decoration: line-through; color:gray; opacity:0.6; }
      #addBtn {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #007BFF;
        color: white;
        font-size: 30px;
        border: none;
        cursor: pointer;
      }
      input#taskInput {
        width: calc(100% - 20px);
        padding: 10px;
        font-size: 16px;
        margin-bottom: 10px;
      }
      button#addTaskBtn {
        padding: 10px 15px;
        background: #28a745;
        color: white;
        border: none;
        cursor: pointer;
        border-radius: 5px;
      }
    `);

    // 3️⃣ Dynamic JS
    $("<button id='addBtn'>+</button>");

    $("#addBtn").Addevent({
      click: () => {
        if (!$("#taskInput")) {
          $("#app").Child([
            "<input id='taskInput' placeholder='Enter task'>",
            "<button id='addTaskBtn'>Add Task</button>"
          ]);

          $("#addTaskBtn").Addevent({
            click: () => {
              const taskValue = $("#taskInput").value.trim();
              if (!taskValue) return;

              $("#app").Child(`<div class="task">${taskValue}</div>`);
              $("#taskInput").value = "";

              const tasks = document.querySelectorAll(".task");
              tasks[tasks.length - 1].Addevent({
                click: function() {
                  this.classList.toggle("completed");
                }
              });
            }
          });
        }
      }
    });
  </script>
</body>
</html>
