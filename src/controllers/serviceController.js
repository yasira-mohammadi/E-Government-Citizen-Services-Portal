const serviceModel = require('../models/serviceModel');

exports.getAllServices = async (req, res) => {
  try {
    const services = await serviceModel.getAllServices();
    res.render('citizen/applyService', { services });
  } catch (err) {
    console.error(err);
    res.send('Error loading services');
  }
};
