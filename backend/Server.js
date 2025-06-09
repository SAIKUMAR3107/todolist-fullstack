const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const e = require("express");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Karthik@Mano",
  database: "todo",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to the database");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.get("/", (req, res) => {
  try {
    db.query("select * from todoItems", (err, result) => {
      if (err) {
        errorValidation(err, res);
      } else {
        console.log("Items fetched successfully:", result);
        res.send(result);
      }
    });
  } catch (e) {
    console.log("Error msg : ", req);
  }
});

app.post("/add-item", (req, res) => {
  console.log("Received item:", req.body);
  db.query(
    `insert into todoItems(itemDescription) values('${req.body.data}')`,
    (err, result) => {
      if (err) {
        console.error("Error inserting item:", err);
        errorValidation(err, res);
      } else {
        console.log("Item inserted successfully:", result);
      }
    }
  );
  res.send(`${req.body.data} --  added successfully`, req.body.data);
});

app.delete("/delete-item", (req, res) => {
  console.log("Received delete request for item ID:", req.body.id);
  db.query(
    `select itemDescription from todoItems where id='${req.body.id}'`,
    (error, results) => {
      if (error) {
        console.error("Error fetching item for deletion:", error);
        errorValidation(error, res);
      } else {
        deletedData = results[0].itemDescription;
        db.query(
          `delete from todoItems where id='${req.body.id}'`,
          (err, result) => {
            if (err) {
              console.error("Error deleting item:", err);
              errorValidation(err, res);
            } else {
              console.log("Item deleted successfully:", result);
              res.send(`${results[0].itemDescription} deleted successfully`);
            }
          }
        );
      }
    }
  );
});

app.put("/update-item", (req, res) => {
  console.log("Received update request for item ID:", req.body.data);

  db.query(
    `select itemDescription from todoItems where id='${req.body.data.id}'`,
    (error, results) => {
      if (error) {
        console.error("Error fetching item for update:", error);
      } else {
        console.log("Item fetched for update:", results[0].itemDescription);
        db.query(
          `update todoItems set itemDescription ='${req.body.data.description}' where ID='${req.body.data.id}'`,
          (err, result) => {
            if (err) {
              console.error("Error updating item:", err);
              errorValidation(err, res);
            } else {
              console.log("Item updated successfully:", result);
              res.send(
                `${results[0].itemDescription} -- is updated to -- ${req.body.data.description}`
              );
            }
          }
        );
      }
    }
  );
});

function errorValidation(err, res) {
  if (err) {
    console.log("Error fetching items:", err.code);
    if (err.code === "ECONNREFUSED") {
      return res.status(503).json({
        status: 503,
        message: "Service Unavailable: Database is down.",
      });
    }

    // Example: Bad SQL or syntax issue
    if (err.code === "ER_PARSE_ERROR") {
      return res
        .status(400)
        .json({ status: 400, message: "Bad Request: Query syntax error." });
    }

    if (err.code === "ER_NO_SUCH_TABLE") {
      return res.status(404).json({
        status: 404,
        message: "Not Found: The requested table does not exist.",
      });
    }

    // Default case for any other DB errors
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error: Unable to fetch data.",
    });
  }
}
