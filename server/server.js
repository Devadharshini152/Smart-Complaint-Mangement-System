// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Health check
app.get("/health", (_req, res) => res.json({ ok: true }));

// ✅ Admin Login (Hardcoded)
app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;
  const ADMIN_USERNAME = "admin";
  const ADMIN_PASSWORD = "admin123";

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return res.json({ message: "Admin login successful", isAdmin: true });
  } else {
    return res.status(401).json({ message: "Invalid admin credentials" });
  }
});

// ✅ Ensure uploads folder exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// ✅ Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ✅ Serve uploaded files
app.use("/uploads", express.static(uploadDir));

// ✅ Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/myNewComplaintDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const db = mongoose.connection;
db.on("connected", () => console.log("🚀 Mongoose connected"));
db.on("error", (err) => console.error("❌ MongoDB connection error:", err));
db.on("disconnected", () => console.log("⚠️ Mongoose disconnected"));

// =====================
// Schemas & Models
// =====================
const citizenSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  username: { type: String, unique: true },
  password: String,
});
const Citizen = mongoose.model("Citizen", citizenSchema);

const employeeSchema = new mongoose.Schema({
  name: String,
  username: { type: String, unique: true },
  password: String,
  department: String,
});
const Employee = mongoose.model("Employee", employeeSchema);

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

// =====================
// Routes
// =====================

// Citizen registration
app.post("/citizens/register", async (req, res) => {
  try {
    const citizen = new Citizen(req.body);
    await citizen.save();
    res.json({ message: "Citizen registered successfully!" });
  } catch (error) {
    res.status(400).json({ message: "Error registering citizen", error });
  }
});

// Citizen login
app.post("/citizens/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const citizen = await Citizen.findOne({ username, password });
    if (!citizen) return res.status(401).json({ message: "Invalid username or password" });
    res.json({ message: "Login successful", citizen });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get citizen by username
app.get("/citizens/:username", async (req, res) => {
  try {
    const citizen = await Citizen.findOne({ username: req.params.username });
    if (!citizen) return res.status(404).json({ message: "Citizen not found" });
    res.json({
      name: citizen.name,
      phone: citizen.phone,
      email: citizen.email,
      username: citizen.username,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Register complaint
//app.post("/complaints", upload.single("image"), async (req, res) => {
app.post("/complaints/register", upload.single("image"), async (req, res) => {
  try {
    const { citizenUsername, title, description, department, location } = req.body;

    const existingComplaint = await Complaint.findOne({
      location,
      department: { $regex: new RegExp(`^${department}$`, "i") },
    });

    if (existingComplaint) {
      return res.status(400).json({
        message: "Complaint already registered for this location and department.",
      });
    }

    const newComplaint = new Complaint({
      citizenUsername,
      title,
      description,
      department,
      image: req.file ? req.file.filename : null,
      location,
    });

    await newComplaint.save();
    res.json({ message: "Complaint submitted successfully", complaint: newComplaint });
  } catch (error) {
    res.status(500).json({ message: "Error submitting complaint", error });
  }
});

// Get all complaints (Admin)
app.get("/complaints/all", async (_req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all complaints", error });
  }
});

// Get complaints by citizen
app.get("/complaints/:username", async (req, res) => {
  try {
    const complaints = await Complaint.find({ citizenUsername: req.params.username });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Error fetching complaints", error });
  }
});
// ✅ Get complaints by department (for employees)
app.get("/employees/complaints/:department", async (req, res) => {
  try {
    const department = req.params.department;
    const complaints = await Complaint.find({
      department: { $regex: new RegExp(`^${department}$`, "i") }
    }).sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Error fetching complaints", error });
  }
});


// Employee registration
app.post("/employees/register", async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.json({ message: "Employee registered successfully!" });
  } catch (error) {
    res.status(400).json({ message: "Error registering employee", error });
  }
});

// Employee login
app.post("/employees/login", async (req, res) => {
  const { username, password, department } = req.body;
  try {
    const employee = await Employee.findOne({ username, password, department });
    if (!employee) return res.status(401).json({ message: "Invalid credentials" });
    res.json({ message: "Login successful", employee });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get employees
app.get("/employees", async (_req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees", error });
  }
});

// Delete employee
app.delete("/employees/:id", async (req, res) => {
  try {
    const deleted = await Employee.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Employee not found" });
    res.json({ message: "Employee removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Update complaint status
app.put("/complaints/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Pending", "In Progress", "Resolved"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });
    res.json({ message: "Complaint status updated", complaint });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// =====================
// Start Server
// =====================
app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
