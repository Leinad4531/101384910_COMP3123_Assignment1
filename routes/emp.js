var express = require('express')
const mongoose = require('mongoose');
var empRoutes = express.Router()

const Employee = mongoose.model('Employee', {
    first_name:{
        type:String,
        required:[true,'Please enter the employee first name']
    },
    last_name:{
        type: String ,
        required:[true,'Please enter the employee last name']
    },
    email:{
        type: String ,
        unique : true,
        required: [true, 'Please enter an email or Email exist']
    },
    gender:{
        type: String,
    },
    salary: {
        type: mongoose.Schema.Types.Number,
        required: true
      }
  });


  empRoutes.get('/employees', async (req, res) => {
    try {
      // Fetch all employees from the database
      const employees = await Employee.find();
      res.status(200).json(employees);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


  empRoutes.post('/employees', async (req, res) => {
    const { first_name, last_name, email, gender, salary } = req.body;
  
    try {
      // Create a new employee instance
      const newEmployee = new Employee({ first_name, last_name, email, gender, salary });
      // Save the employee to the database
      await newEmployee.save();
      res.status(201).json({
        first_name: first_name,
        last_name: last_name,
        email: email,
        gender: gender,
        salary: salary
        
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({
         status: false,
         message:'Error while creating Emplyee!',
         });
    }
  });


  empRoutes.get('/employees/:eid', async (req, res) => {
    const employeeId = req.params.eid;


    try {
      // Find employee by ID in the database
      const employee = await Employee.findById(employeeId);
  
      if (!employee) {
        // If employee with the given ID is not found
        return res.status(404).json({ error: 'Employee not found' });
      }

      // If employee with the given ID is found, send employee details in the response
      res.status(200).json(employee);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  //update employee details
  empRoutes.put('/employees/:eid', async (req, res) => {
    const eid = req.params.eid;
    const { first_name, last_name, email, gender, salary } = req.body;
  
    try {
      const updatedEmployee = await Employee.findByIdAndUpdate(eid, {
        first_name: first_name,
        last_name: last_name,
        email: email,
        gender: gender,
        salary: salary
      }, { new: true }); // { new: true } returns the updated document
  
      if (!updatedEmployee) {
        return res.status(404).json({ error: 'Employee not found' });
      }
  
      res.status(200).json(updatedEmployee);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  empRoutes.delete('/employees', async (req, res) => {
    const employeeId = req.query.eid;
  
    try {
      // Find employee by ID in the database
      const deleteEmployee = await Employee.findByIdAndDelete(employeeId);
  
      if (!deleteEmployee) {
        // If employee with the given ID is not found
        res.status(404).json({ error: 'Employee not found' });
      }
  
      // If employee with the given ID is found, send employee details in the response
      res.send("Deleted Successfully")
      res.status(204)
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  module.exports = empRoutes;