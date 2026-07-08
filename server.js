const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Vehicle = require("./models/Vehicle");
const Alert = require("./models/Alert");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(
  "mongodb+srv://v2vadmin:RKS2007@cluster.bgmgo8m.mongodb.net/v2vdb?retryWrites=true&w=majority"
)
.then(() => {
  console.log("MongoDB Connected");
})
.catch((err) => {
  console.log(err);
});

app.get("/", (req, res) => {
  res.send("V2V Backend Running Successfully");
});
app.post("/register", async (req, res) => {

    try {

        const {
            name,
            phone,
            vehicleNumber,
            latitude,
            longitude
        } = req.body;

        const existing = await Vehicle.findOne({ vehicleNumber });

if (existing) {

    return res.json({

        success: false,

        message: "Vehicle already registered"

    });

}

        const vehicle = new Vehicle({
            name,
            phone,
            vehicleNumber,
            latitude,
            longitude,
            loginTime: new Date(),
            status: "Online"
        });

        await vehicle.save();

        res.json({
            success: true,
            message: "Vehicle Registered Successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Registration Failed"
        });
    }
});
app.get("/vehicles", async (req, res) => {

    try {

        const vehicles = await Vehicle.find();

        res.json(vehicles);

    } catch (error) {

        res.status(500).json({
            message: "Error fetching vehicles"
        });
    }
});


app.delete("/vehicles/:id", async (req, res) => {

    try {

        await Vehicle.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Vehicle Deleted"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Delete Failed"
        });
    }
});

app.post("/alert", async (req, res) => {

    try {

        const {
            vehicleNumber,
            latitude,
            longitude
        } = req.body;

        const alert = new Alert({

            vehicleNumber,

            latitude,

            longitude,

            alertType: req.body.alertType || "ACCIDENT"
        });

        await alert.save();

        res.json({

            success: true,

            message: "ACCIDENT Alert Sent Successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: "SOS Failed"
        });
    }
});

app.get("/alerts", async (req, res) => {

    try {

        const alerts = await Alert.find();

        res.json(alerts);

    } catch (error) {

        res.status(500).json({
            message: "Error fetching alerts"
        });
    }
});

app.get("/status", (req, res) => {
    if (mongoose.connection.readyState === 1) {
        res.json({
            connected: true
        });
    } else {
        res.json({
            connected: false
        });
    }
});

app.post("/logout", async (req, res) => {

    try {

        const { vehicleNumber } = req.body;

        await Vehicle.findOneAndUpdate(
            { vehicleNumber },
            {
                logoutTime: new Date(),
                status: "Offline"
            }
        );

        res.json({
            success: true,
            message: "Logout saved"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Logout failed"
        });
    }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

const activitySchema = new mongoose.Schema({
    name: String,
    vehicleNumber: String,
    loginTime: Date,
    logoutTime: Date,
    status: String
});

const Activity = mongoose.model("Activity", activitySchema);