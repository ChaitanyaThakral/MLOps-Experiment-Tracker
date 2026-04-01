const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');

const envVariables = loadEnvFile('./.env');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};

// initialize connection pool
async function initializeConnectionPool() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('Connection pool started');
    } catch (err) {
        console.error('Initialization error: ' + err.message);
    }
}

async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
        console.log('Pool closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

initializeConnectionPool();

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);


// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(); // Gets a connection from the default pool 
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}


// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}

/*
async function fetchDemotableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM DEMOTABLE');
        return result.rows;
    }).catch(() => {
        return [];
    });
}
*/

async function fetchRuns() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'SELECT * FROM Run ORDER BY run_id',
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        return result.rows;
    }).catch((err) => {
        console.error("fetchRuns Error:", err.message);
        return [];
    });
}

async function fetchProjects() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'SELECT * FROM Project ORDER BY project_id',
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        return result.rows;
    }).catch((err) => {
        console.error("fetchProjects Error:", err.message);
        return [];
    });
}

async function insertRun(run_id, start_time, end_time, execution_status, project_id, model_id, dataset_id, config_id) {
    const s_time = start_time ? start_time.replace('T', ' ') : null;
    const e_time = end_time ? end_time.replace('T', ' ') : null;

    return await withOracleDB(async (connection) => {
        try {
            const allowedStatuses = ['COMPLETED', 'FAILED', 'RUNNING'];

            if (!Number.isInteger(Number(run_id))) {
                return { success: false, message: "run_id must be an integer." };
            }
            if (!Number.isInteger(Number(project_id))) {
                return { success: false, message: "project_id must be an integer." };
            }
            if (!Number.isInteger(Number(model_id))) {
                return { success: false, message: "model_id must be an integer." };
            }
            if (!Number.isInteger(Number(dataset_id))) {
                return { success: false, message: "dataset_id must be an integer." };
            }
            if (!Number.isInteger(Number(config_id))) {
                return { success: false, message: "config_id must be an integer." };
            }
            if (!execution_status || !allowedStatuses.includes(String(execution_status).toUpperCase())) {
                return {
                    success: false,
                    message: "execution_status must be COMPLETED, FAILED, or RUNNING."
                };
            }

            await connection.execute(
                `INSERT INTO Run (
                    run_id,
                    start_time,
                    end_time,
                    execution_status,
                    project_id,
                    model_id,
                    dataset_id,
                    config_id
                ) VALUES (
                    :run_id,
                    TO_TIMESTAMP(:s_time, 'YYYY-MM-DD HH24:MI:SS'),
                    TO_TIMESTAMP(:e_time, 'YYYY-MM-DD HH24:MI:SS'),
                    :execution_status,
                    :project_id,
                    :model_id,
                    :dataset_id,
                    :config_id
                )`,
                {
                    run_id: Number(run_id),
                    s_time,
                    e_time,
                    execution_status: String(execution_status).toUpperCase(),
                    project_id: Number(project_id),
                    model_id: Number(model_id),
                    dataset_id: Number(dataset_id),
                    config_id: Number(config_id)
                },
                { autoCommit: true }
            );

            return { success: true, message: "Run inserted successfully!" };
        } catch (err) {
            if (err.message.includes("ORA-02291")) {
                return {
                    success: false,
                    message: "Insertion failed: One of the IDs provided for Project, Model, Dataset, or Config does not exist in the database."
                };
            }
            if (err.message.includes("ORA-00001")) {
                return {
                    success: false,
                    message: "Insertion failed: A Run with this ID already exists."
                };
            }
            console.error("Error inserting run:", err.message);
            return { success: false, message: "An unexpected database error occurred." };
        }
    });
}

async function fetchHyperparameters() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'SELECT * FROM Hyperparameter ORDER BY parameter_id',
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        return result.rows;
    }).catch((err) => {
        console.error("fetchHyperparameters Error:", err.message);
        return [];
    });
}

async function updateHyperparameter(parameter_id, hyperparam_name, default_value, is_required, datatype) {
    return await withOracleDB(async (connection) => {
        try {
            const updates = [];
            const binds = { parameter_id };

            if (hyperparam_name !== undefined && hyperparam_name !== null && hyperparam_name !== "") {
                updates.push("hyperparam_name = :hyperparam_name");
                binds.hyperparam_name = hyperparam_name;
            }
            if (default_value !== undefined && default_value !== null && default_value !== "") {
                updates.push("default_value = :default_value");
                binds.default_value = default_value;
            }
            if (is_required !== undefined && is_required !== null && is_required !== "") {
                updates.push("is_required = :is_required");
                binds.is_required = is_required;
            }
            if (datatype !== undefined && datatype !== null && datatype !== "") {
                updates.push("datatype = :datatype");
                binds.datatype = datatype;
            }

            if (updates.length === 0) {
                return { success: false, message: "No attributes provided to update." };
            }

            const sqlQuery = `
                UPDATE Hyperparameter 
                SET ${updates.join(", ")} 
                WHERE parameter_id = :parameter_id
            `;

            const result = await connection.execute(sqlQuery, binds, { autoCommit: true });

            if (result.rowsAffected === 0) {
                return { success: false, message: "Update failed: No hyperparameter found with that ID." };
            }
            return { success: true, message: "Hyperparameter updated successfully!" };

        } catch (err) {
            if (err.message.includes("ORA-00001")) {
                return {
                    success: false,
                    message: "Update failed: A hyperparameter with that name already exists (UNIQUE constraint)."
                };
            }
            console.error("Error updating hyperparameter:", err.message);
            return { success: false, message: "An unexpected database error occurred." };
        }
    });
}

async function deleteRun(run_id) {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `DELETE FROM Run WHERE run_id = :run_id`,
                { run_id },
                { autoCommit: true }
            );

            if (result.rowsAffected === 0) {
                return { success: false, message: `Delete failed: No Run found with ID ${run_id}.` };
            }

            return {
                success: true,
                message: `Run ${run_id} deleted successfully! (Cascaded to associated metrics and hyperparameters)`
            };

        } catch (err) {
            console.error("Error deleting run:", err.message);
            return { success: false, message: "An unexpected database error occurred during deletion." };
        }
    });
}

/*
async function initiateDemotable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE DEMOTABLE`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE DEMOTABLE (
                id NUMBER PRIMARY KEY,
                name VARCHAR2(20)
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function insertDemotable(id, name) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO DEMOTABLE (id, name) VALUES (:id, :name)`,
            [id, name],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateNameDemotable(oldName, newName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE DEMOTABLE SET name=:newName where name=:oldName`,
            [newName, oldName],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function countDemotable() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM DEMOTABLE');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}
*/

async function selectRuns(conditions) {
    return await withOracleDB(async (connection) => {
        try {
            let sqlQuery = `SELECT * FROM Run`;
            const binds = {};

            if (conditions && conditions.length > 0) {
                sqlQuery += ` WHERE `;

                const allowedAttributes = [
                    'run_id',
                    'execution_status',
                    'project_id',
                    'model_id',
                    'dataset_id',
                    'config_id'
                ];
                const allowedOperators = ['=', '!=', '>', '<', '>=', '<='];
                const allowedLogicals = ['AND', 'OR', ''];

                for (let i = 0; i < conditions.length; i++) {
                    const cond = conditions[i];

                    if (!cond.attribute || !allowedAttributes.includes(String(cond.attribute).toLowerCase())) {
                        throw new Error(`Invalid attribute: ${cond.attribute}`);
                    }

                    if (!cond.operator || !allowedOperators.includes(cond.operator)) {
                        throw new Error(`Invalid operator: ${cond.operator}`);
                    }

                    const logicalOp = i === 0 ? '' : String(cond.logical_op || '').toUpperCase();
                    if (i > 0 && !allowedLogicals.includes(logicalOp)) {
                        throw new Error(`Invalid logical operator: ${cond.logical_op}`);
                    }

                    if (i > 0) {
                        sqlQuery += ` ${logicalOp} `;
                    }

                    const attribute = String(cond.attribute).toLowerCase();
                    const bindKey = `val${i}`;

                    sqlQuery += `${attribute} ${cond.operator} :${bindKey}`;
                    binds[bindKey] = cond.value;
                }
            }

            const result = await connection.execute(
                sqlQuery,
                binds,
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );

            return { success: true, data: result.rows };
        } catch (err) {
            console.error("Error in selectRuns:", err.message);
            return { success: false, message: err.message };
        }
    });
}

async function joinRunsByMetric(target_metric_name, max_metric_value) {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `SELECT r.run_id, r.execution_status, r.project_id, m.metric_name, m.metric_value, mt.unit
                 FROM Run r
                 JOIN Metric m ON r.run_id = m.run_id
                 JOIN MetricType mt ON m.metric_name = mt.metric_name
                 WHERE m.metric_name = :target_metric_name 
                 AND m.metric_value <= :max_metric_value`,
                {
                    target_metric_name: target_metric_name,
                    max_metric_value: max_metric_value
                },
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            return { success: true, data: result.rows };

        } catch (err) {
            console.error("Error in joinRunsByMetric:", err.message);
            return { success: false, message: "An unexpected database error occurred during the join." };
        }
    });
}

async function projectRuns(attributes) {
    return await withOracleDB(async (connection) => {
        try {
            const allowedAttributes = [
                'run_id',
                'start_time',
                'end_time',
                'execution_status',
                'project_id',
                'model_id',
                'dataset_id',
                'config_id'
            ];

            if (!Array.isArray(attributes) || attributes.length === 0) {
                return { success: false, message: 'At least one attribute must be selected.' };
            }

            const normalizedAttributes = attributes.map(attr => String(attr).toLowerCase());

            for (const attr of normalizedAttributes) {
                if (!allowedAttributes.includes(attr)) {
                    return { success: false, message: `Invalid attribute: ${attr}` };
                }
            }

            const sqlQuery = `SELECT ${normalizedAttributes.join(', ')} FROM Run`;
            const result = await connection.execute(
                sqlQuery,
                [],
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );

            return { success: true, data: result.rows };
        } catch (err) {
            console.error('projectRuns Error:', err.message);
            return { success: false, message: 'An unexpected database error occurred.' };
        }
    });
}

async function countRunsPerProject() {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `SELECT project_id, COUNT(*) AS run_count
                 FROM Run
                 GROUP BY project_id
                 ORDER BY project_id`,
                [],
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );

            return { success: true, data: result.rows };
        } catch (err) {
            console.error('countRunsPerProject Error:', err.message);
            return { success: false, message: 'An unexpected database error occurred.' };
        }
    });
}


async function projectsWithMinRuns(minRuns) {
    return await withOracleDB(async (connection) => {
        try {
            if (!Number.isInteger(minRuns) || minRuns < 1) {
                return { success: false, message: 'minRuns must be a positive integer.' };
            }

            const result = await connection.execute(
                `SELECT project_id, COUNT(*) AS run_count
                 FROM Run
                 GROUP BY project_id
                 HAVING COUNT(*) >= :minRuns
                 ORDER BY project_id`,
                { minRuns },
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );

            return { success: true, data: result.rows };
        } catch (err) {
            console.error('projectsWithMinRuns Error:', err.message);
            return { success: false, message: 'An unexpected database error occurred.' };
        }
    });
}

async function bestProjectsByMetric(metric_name) {
    return await withOracleDB(async (connection) => {
        try {
            if (!metric_name || typeof metric_name !== 'string') {
                return { success: false, message: 'metric_name is required.' };
            }

            const result = await connection.execute(
                `SELECT r.project_id, AVG(m.metric_value) AS avg_metric
                 FROM Run r
                 JOIN Metric m ON r.run_id = m.run_id
                 WHERE m.metric_name = :metric_name
                 GROUP BY r.project_id
                 HAVING AVG(m.metric_value) >= ALL (
                     SELECT AVG(m2.metric_value)
                     FROM Run r2
                     JOIN Metric m2 ON r2.run_id = m2.run_id
                     WHERE m2.metric_name = :metric_name
                     GROUP BY r2.project_id
                 )
                 ORDER BY r.project_id`,
                { metric_name: metric_name.toLowerCase() },
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );

            return { success: true, data: result.rows };
        } catch (err) {
            console.error('bestProjectsByMetric Error:', err.message);
            return { success: false, message: 'An unexpected database error occurred.' };
        }
    });
}

async function runsWithAllRequiredHyperparameters() {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `SELECT r.run_id
                 FROM Run r
                 WHERE NOT EXISTS (
                     SELECT h.parameter_id
                     FROM Hyperparameter h
                     WHERE h.is_required = 'Y'
                       AND NOT EXISTS (
                           SELECT 1
                           FROM Uses u
                           WHERE u.run_id = r.run_id
                             AND u.parameter_id = h.parameter_id
                       )
                 )
                 ORDER BY r.run_id`,
                [],
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );

            return { success: true, data: result.rows };
        } catch (err) {
            console.error('runsWithAllRequiredHyperparameters Error:', err.message);
            return { success: false, message: 'An unexpected database error occurred.' };
        }
    });
}

module.exports = {
    testOracleConnection,
    fetchRuns,
    fetchProjects,
    insertRun,
    fetchHyperparameters,
    updateHyperparameter,
    deleteRun,
    selectRuns,
    joinRunsByMetric,
    projectRuns,
    countRunsPerProject,
    projectsWithMinRuns,
    bestProjectsByMetric,
    runsWithAllRequiredHyperparameters
};