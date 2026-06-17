require('dotenv').config();
const express = require('express');
const { safeLog } = require('./logger');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const vehicles = [];

function isValidVehicle(body) {
  const { id, owner, model, lastServiceDate, serviceIntervalMonths } = body || {};
  return Boolean(
    id &&
    owner &&
    model &&
    lastServiceDate &&
    Number.isInteger(serviceIntervalMonths) &&
    serviceIntervalMonths > 0 &&
    !Number.isNaN(Date.parse(lastServiceDate))
  );
}

function getDueDate(vehicle) {
  const dueDate = new Date(vehicle.lastServiceDate);
  dueDate.setMonth(dueDate.getMonth() + vehicle.serviceIntervalMonths);
  return dueDate;
}

app.post('/api/vehicles', async (req, res) => {
  try {
    if (!isValidVehicle(req.body)) {
      await safeLog('warn', 'invalid vehicle payload');
      return res.status(400).json({ message: 'Invalid vehicle data' });
    }

    const duplicate = vehicles.find((v) => v.id === req.body.id);
    if (duplicate) {
      await safeLog('warn', `duplicate vehicle ${req.body.id}`);
      return res.status(409).json({ message: 'Vehicle already exists' });
    }

    vehicles.push(req.body);
    await safeLog('info', `vehicle added ${req.body.id}`);
    return res.status(201).json({ message: 'Vehicle added', vehicle: req.body });
  } catch (error) {
    await safeLog('error', 'failed to add vehicle');
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/vehicles', async (req, res) => {
  try {
    await safeLog('info', 'fetched all vehicles');
    return res.json({ vehicles });
  } catch (error) {
    await safeLog('error', 'failed to fetch vehicles');
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/vehicles/due', async (req, res) => {
  try {
    const today = new Date();
    const dueVehicles = vehicles.filter((v) => getDueDate(v) <= today);
    await safeLog('info', 'fetched due vehicles');
    return res.json({ vehicles: dueVehicles });
  } catch (error) {
    await safeLog('error', 'failed to fetch due vehicles');
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(port, () => {
  console.log(`Vehicle scheduler running on port ${port}`);
});
