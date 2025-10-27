// checkDB.js
import mongoose from "mongoose";

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myNewComplaintDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("MongoDB connection error:", err));

/* ==============================
   Schemas & Models (same as server)
=================================*/

// Citizen
const citizenSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  username: { type: String, unique: true },
  password: String,
});
const Citizen = mongoose.model("Citizen", citizenSchema);

// Employee
const employeeSchema = new mongoose.Schema({
  name: String,
  username: { type: String, unique: true },
  password: String,
  department: String,
});
const Employee = mongoose.model("Employee", employeeSchema);

// Complaint
const complaintSchema = new mongoose.Schema({
  citizenUsername: String,
  title: String,
  description: String,
  department: String,
  image: String,
  location: String,
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});
const Complaint = mongoose.model("Complaint", complaintSchema);

/* ==============================
   Fetch and print all records
=================================*/

async function checkDatabase() {
  try {
    const citizens = await Citizen.find();
    const employees = await Employee.find();
    const complaints = await Complaint.find();

    console.log("\n===== Citizens =====");
    console.log(citizens);

    console.log("\n===== Employees =====");
    console.log(employees);

    console.log("\n===== Complaints =====");
    console.log(complaints);

    mongoose.connection.close();
  } catch (err) {
    console.error("Error fetching data:", err);
    mongoose.connection.close();
  }
}

checkDatabase();
