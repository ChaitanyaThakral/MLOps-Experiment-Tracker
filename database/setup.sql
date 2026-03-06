drop table Metric;
drop table Uses;
drop table Creates;
drop table Run;
drop table Phase;
drop table Regression;
drop table Classification;
drop table Clustering;
drop table Hyperparameter;
drop table MetricType;
drop table HardwareConfiguration;
drop table Dataset;
drop table Model;
drop table PhaseComplexity;
drop table Project;
drop table Author;

CREATE TABLE Author
(
    email VARCHAR(100),
    organization VARCHAR(100),
    role VARCHAR(100),
    fullname VARCHAR(100),
    PRIMARY KEY (email)
);

CREATE TABLE Project
(
    project_id INTEGER,
    name VARCHAR(100),
    deadline DATE,
    start_date DATE,
    PRIMARY KEY (project_id)
);

CREATE TABLE PhaseComplexity
(
    phase_name VARCHAR(100),
    complexity_score INTEGER,
    PRIMARY KEY (phase_name)
);

CREATE TABLE Phase
(
    phase_name VARCHAR(100),
    project_id INTEGER,
    estimated_hours FLOAT,
    description VARCHAR(500),
    PRIMARY KEY
        (
         phase_name,
         project_id
            ),
    FOREIGN KEY (phase_name) REFERENCES PhaseComplexity (phase_name) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES Project (project_id) ON DELETE CASCADE
);

CREATE TABLE Hyperparameter
(
    parameter_id INTEGER,
    hyperparam_name VARCHAR(100),
    default_value VARCHAR(100),
    is_required CHAR(1),
    datatype VARCHAR(100),
    PRIMARY KEY (parameter_id),
    UNIQUE (hyperparam_name)
);

CREATE TABLE Dataset
(
    dataset_id INTEGER,
    format VARCHAR(100),
    row_count INTEGER,
    feature_count INTEGER,
    creation_date DATE,
    PRIMARY KEY (dataset_id)
);

CREATE TABLE HardwareConfiguration
(
    config_id INTEGER,
    gpu_type VARCHAR(100),
    cpu_cores INTEGER,
    memory_GB FLOAT,
    PRIMARY KEY (config_id)
);

CREATE TABLE Model
(
    model_id INTEGER,
    file_path VARCHAR(255),
    format VARCHAR(100),
    size_bytes INTEGER,
    PRIMARY KEY (model_id),
    UNIQUE (file_path)
);

CREATE TABLE Regression
(
    model_id INTEGER,
    target_transform VARCHAR(100),
    PRIMARY KEY (model_id),
    FOREIGN KEY (model_id) REFERENCES Model (model_id) ON DELETE CASCADE
);

CREATE TABLE Classification
(
    model_id INTEGER,
    decision_threshold FLOAT,
    PRIMARY KEY (model_id),
    FOREIGN KEY (model_id) REFERENCES Model (model_id) ON DELETE CASCADE
);

CREATE TABLE Clustering
(
    model_id INTEGER,
    algorithm_family VARCHAR(100),
    PRIMARY KEY (model_id),
    FOREIGN KEY (model_id) REFERENCES Model (model_id) ON DELETE CASCADE
);

CREATE TABLE MetricType
(
    metric_name VARCHAR(100),
    unit VARCHAR(100),
    goal VARCHAR(100),
    min_value FLOAT,
    max_value FLOAT,
    PRIMARY KEY (metric_name)
);

CREATE TABLE Run
(
    run_id INTEGER,
    start_time TIMESTAMP NULL,
    end_time TIMESTAMP NULL,
    execution_status VARCHAR(20),
    project_id INTEGER NOT NULL,
    model_id INTEGER NOT NULL,
    dataset_id INTEGER NOT NULL,
    config_id INTEGER NOT NULL,
    PRIMARY KEY (run_id),
    FOREIGN KEY (project_id) REFERENCES Project (project_id) ON DELETE CASCADE,
    FOREIGN KEY (model_id) REFERENCES Model (model_id) ON DELETE CASCADE,
    FOREIGN KEY (dataset_id) REFERENCES Dataset (dataset_id) ON DELETE CASCADE,
    FOREIGN KEY (config_id) REFERENCES HardwareConfiguration (config_id) ON DELETE CASCADE
);

CREATE TABLE Metric
(
    metric_id INTEGER,
    metric_name VARCHAR(100) NOT NULL,
    run_id INTEGER NOT NULL,
    metric_value FLOAT,
    PRIMARY KEY (metric_id),
    FOREIGN KEY (metric_name) REFERENCES MetricType (metric_name) ON DELETE CASCADE,
    FOREIGN KEY (run_id) REFERENCES Run (run_id) ON DELETE CASCADE
);

CREATE TABLE Creates
(
    email VARCHAR(100),
    project_id INTEGER,
    PRIMARY KEY
        (
         email,
         project_id
            ),
    FOREIGN KEY (email) REFERENCES Author (email) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES Project (project_id) ON DELETE CASCADE
);

CREATE TABLE Uses
(
    run_id INTEGER,
    parameter_id INTEGER,
    hyperparam_value VARCHAR(100),
    PRIMARY KEY
        (
         run_id,
         parameter_id
            ),
    FOREIGN KEY (run_id) REFERENCES Run (run_id) ON DELETE CASCADE,
    FOREIGN KEY (parameter_id) REFERENCES Hyperparameter (parameter_id) ON DELETE CASCADE
);

INSERT INTO Author VALUES ('mark@email.com', 'UBC', 'Student', 'Mark John');
INSERT INTO Author VALUES ('adi@email.com', 'UBC', 'Teaching Assistant', 'Adi John');
INSERT INTO Author VALUES ('chaitanya@email.com', 'UBC', 'Student', 'Chaitanya John');
INSERT INTO Author VALUES ('john@email.com', 'SFU', 'Professor', 'John Joe');
INSERT INTO Author VALUES ('frank@email.com', 'UVIC', 'Student', 'Frank Johnson');

INSERT INTO Project VALUES (1, 'Project 1', DATE '2026-04-01', DATE '2026-01-01');
INSERT INTO Project VALUES (2, 'Project 2', DATE '2026-04-02', DATE '2026-01-02');
INSERT INTO Project VALUES (3, 'Project 3', DATE '2026-04-03', DATE '2026-01-03');
INSERT INTO Project VALUES (4, 'Project 4', DATE '2026-04-04', DATE '2026-01-04');
INSERT INTO Project VALUES (5, 'Project 5', DATE '2026-04-05', DATE '2026-01-05');

INSERT INTO PhaseComplexity VALUES ('Data Collection', 2);
INSERT INTO PhaseComplexity VALUES ('Preprocessing', 3);
INSERT INTO PhaseComplexity VALUES ('Training', 5);
INSERT INTO PhaseComplexity VALUES ('Evaluation', 3);
INSERT INTO PhaseComplexity VALUES ('Deployment', 4);

INSERT INTO Phase VALUES ('Data Collection', 1, 5, 'Collect all the data');
INSERT INTO Phase VALUES ('Preprocessing', 2, 10, 'Prepare the data');
INSERT INTO Phase VALUES ('Training', 3, 15, 'Train the model on the data');
INSERT INTO Phase VALUES ('Evaluation', 4, 20, 'Evaluate the results');
INSERT INTO Phase VALUES ('Deployment', 5, 25, 'Deploy the model');

INSERT INTO Hyperparameter VALUES (1, 'learning_rate', '0.01', 'Y', 'FLOAT');
INSERT INTO Hyperparameter VALUES (2, 'batch_size', '32', 'Y', 'INTEGER');
INSERT INTO Hyperparameter VALUES (3, 'epochs', '10', 'Y', 'INTEGER');
INSERT INTO Hyperparameter VALUES (4, 'dropout', '0.2', 'N', 'FLOAT');
INSERT INTO Hyperparameter VALUES (5, 'max_depth', '5', 'N', 'INTEGER');

INSERT INTO Dataset VALUES (1, 'CSV', 1000, 20, DATE '2026-01-01');
INSERT INTO Dataset VALUES (2, 'CSV', 1500, 25, DATE '2026-01-02');
INSERT INTO Dataset VALUES (3, 'JSON', 2000, 30, DATE '2026-01-03');
INSERT INTO Dataset VALUES (4, 'XML', 2500, 35, DATE '2026-01-04');
INSERT INTO Dataset VALUES (5, 'CSV', 3000, 40, DATE '2026-01-05');

INSERT INTO HardwareConfiguration VALUES (1, 'RX 7900', 8, 16);
INSERT INTO HardwareConfiguration VALUES (2, 'NVIDIA H100', 16, 32);
INSERT INTO HardwareConfiguration VALUES (3, 'NVIDIA A100', 32, 64);
INSERT INTO HardwareConfiguration VALUES (4, 'RTX 4090', 24, 128);
INSERT INTO HardwareConfiguration VALUES (5, 'RTX 5090', 32, 256);

INSERT INTO Model VALUES (1, '/models/reg1', 'MODEL', 1000);
INSERT INTO Model VALUES (2, '/models/reg2', 'MODEL', 1100);
INSERT INTO Model VALUES (3, '/models/reg3', 'MODEL', 1200);
INSERT INTO Model VALUES (4, '/models/reg4', 'MODEL', 1300);
INSERT INTO Model VALUES (5, '/models/reg5', 'MODEL', 1400);

INSERT INTO Model VALUES (6, '/models/cls1', 'MODEL', 1500);
INSERT INTO Model VALUES (7, '/models/cls2', 'MODEL', 1600);
INSERT INTO Model VALUES (8, '/models/cls3', 'MODEL', 1700);
INSERT INTO Model VALUES (9, '/models/cls4', 'MODEL', 1800);
INSERT INTO Model VALUES (10, '/models/cls5', 'MODEL', 1900);

INSERT INTO Model VALUES (11, '/models/clust1', 'MODEL', 2000);
INSERT INTO Model VALUES (12, '/models/clust2', 'MODEL', 2100);
INSERT INTO Model VALUES (13, '/models/clust3', 'MODEL', 2200);
INSERT INTO Model VALUES (14, '/models/clust4', 'MODEL', 2300);
INSERT INTO Model VALUES (15, '/models/clust5', 'MODEL', 2400);

INSERT INTO Regression VALUES (1, 'log');
INSERT INTO Regression VALUES (2, 'none');
INSERT INTO Regression VALUES (3, 'standardize');
INSERT INTO Regression VALUES (4, 'normalize');
INSERT INTO Regression VALUES (5, 'sqrt');

INSERT INTO Classification VALUES (6, 0.50);
INSERT INTO Classification VALUES (7, 0.55);
INSERT INTO Classification VALUES (8, 0.60);
INSERT INTO Classification VALUES (9, 0.65);
INSERT INTO Classification VALUES (10, 0.70);

INSERT INTO Clustering VALUES (11, 'K-Means');
INSERT INTO Clustering VALUES (12, 'DBSCAN');
INSERT INTO Clustering VALUES (13, 'Hierarchical');
INSERT INTO Clustering VALUES (14, 'MeanShift');
INSERT INTO Clustering VALUES (15, 'Spectral');

INSERT INTO Creates VALUES ('mark@email.com', 1);
INSERT INTO Creates VALUES ('adi@email.com', 2);
INSERT INTO Creates VALUES ('chaitanya@email.com', 3);
INSERT INTO Creates VALUES ('john@email.com', 4);
INSERT INTO Creates VALUES ('frank@email.com', 5);

INSERT INTO Run VALUES (1, TIMESTAMP '2026-01-01 09:00:00', TIMESTAMP '2026-01-01 10:00:00', 'COMPLETED', 1, 2, 3, 4);
INSERT INTO Run VALUES (2, TIMESTAMP '2026-01-02 10:00:00', TIMESTAMP '2026-01-02 11:00:00', 'COMPLETED', 5, 4, 3, 2);
INSERT INTO Run VALUES (3, TIMESTAMP '2026-01-03 11:00:00', TIMESTAMP '2026-01-03 12:00:00', 'FAILED', 1, 2, 3, 4);
INSERT INTO Run VALUES (4, TIMESTAMP '2026-01-04 12:00:00', TIMESTAMP '2026-01-04 13:00:00', 'COMPLETED', 4, 4, 4, 4);
INSERT INTO Run VALUES (5, TIMESTAMP '2026-01-05 13:00:00', NULL, 'RUNNING', 5, 2, 4, 3);

INSERT INTO Uses VALUES (1, 1, '0.001');
INSERT INTO Uses VALUES (2, 2, '64');
INSERT INTO Uses VALUES (3, 3, '12');
INSERT INTO Uses VALUES (4, 4, '0.2');
INSERT INTO Uses VALUES (5, 1, '0.05');

INSERT INTO MetricType VALUES ('mae', 'score', 'MIN', 0, 100);
INSERT INTO MetricType VALUES ('mse', 'score', 'MIN', 0, 1000);
INSERT INTO MetricType VALUES ('rmse', 'score', 'MIN', 0, 100);
INSERT INTO MetricType VALUES ('r2', 'score', 'MAX', 0, 1);
INSERT INTO MetricType VALUES ('loss', 'score', 'MIN', 0, 100);

INSERT INTO Metric VALUES (1, 'mae', 1, 9.5);
INSERT INTO Metric VALUES (2, 'mse', 2, 80.0);
INSERT INTO Metric VALUES (3, 'rmse', 3, 8.5);
INSERT INTO Metric VALUES (4, 'r2', 4, 0.76);
INSERT INTO Metric VALUES (5, 'loss', 5, 12.2);