const express = require('express');
const appService = require('./appService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

/*
router.get('/demotable', async (req, res) => {
    const tableContent = await appService.fetchDemotableFromDb();
    res.json({data: tableContent});
});
*/

router.get('/runs', async (req, res) => {
    const tableContent = await appService.fetchRuns();
    res.json({data: tableContent});
});

router.get('/projects', async (req, res) => {
    const tableContent = await appService.fetchProjects();
    res.json({data: tableContent});
});

router.post("/insert-run", async (req, res) => {
    const { run_id, start_time, end_time, execution_status, project_id, model_id, dataset_id, config_id } = req.body;
    const result = await appService.insertRun(run_id, start_time, end_time, execution_status, project_id, model_id, dataset_id, config_id);
    if (result.success) {
        res.json({ success: true, message: result.message });
    } else {
        res.status(400).json({ success: false, error: result.message });
    }
});

router.get('/hyperparameters', async (req, res) => {
    const tableContent = await appService.fetchHyperparameters();
    res.json({data: tableContent});
});

router.put('/update-hyperparameter', async (req, res) => {
    const { parameter_id, hyperparam_name, default_value, is_required, datatype } = req.body;
    const result = await appService.updateHyperparameter(parameter_id, hyperparam_name, default_value, is_required, datatype);
    if (result.success) {
        res.json({ success: true, message: result.message });
    } else {
        res.status(400).json({ success: false, error: result.message });
    }
});

router.delete('/delete-run/:runId', async (req, res) => {
    const runId = req.params.runId;
    const result = await appService.deleteRun(runId);
    if (result.success) {
        res.json({ success: true, message: result.message });
    } else {
        res.status(400).json({ success: false, error: result.message });
    }
});

/*
router.post("/initiate-demotable", async (req, res) => {
    const initiateResult = await appService.initiateDemotable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-demotable", async (req, res) => {
    const { id, name } = req.body;
    const insertResult = await appService.insertDemotable(id, name);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-name-demotable", async (req, res) => {
    const { oldName, newName } = req.body;
    const updateResult = await appService.updateNameDemotable(oldName, newName);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/count-demotable', async (req, res) => {
    const tableCount = await appService.countDemotable();
    if (tableCount >= 0) {
        res.json({ 
            success: true,  
            count: tableCount
        });
    } else {
        res.status(500).json({ 
            success: false, 
            count: tableCount
        });
    }
});
*/


module.exports = router;