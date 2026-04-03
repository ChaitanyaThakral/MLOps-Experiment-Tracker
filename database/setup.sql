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
INSERT INTO Author VALUES ('adi@email.com', 'UBC', 'Teaching Assistant', 'Adi Yadav');
INSERT INTO Author VALUES ('chaitanya@email.com', 'UBC', 'Student', 'Chaitanya John');
INSERT INTO Author VALUES ('john@email.com', 'SFU', 'Professor', 'John Joe');
INSERT INTO Author VALUES ('frank@email.com', 'UVIC', 'Student', 'Frank Johnson');
INSERT INTO Author VALUES ('bob@email.com', 'UBC', 'Research Assistant', 'Bob Dylan');

INSERT INTO Project VALUES (1, 'House Price Regression', DATE '2026-04-20', DATE '2026-01-05');
INSERT INTO Project VALUES (2, 'Customer Churn Classification', DATE '2026-04-22', DATE '2026-01-08');
INSERT INTO Project VALUES (3, 'Image Clustering Study', DATE '2026-04-25', DATE '2026-01-12');
INSERT INTO Project VALUES (4, 'Energy Forecasting', DATE '2026-04-27', DATE '2026-01-15');
INSERT INTO Project VALUES (5, 'Fraud Detection', DATE '2026-04-29', DATE '2026-01-18');
INSERT INTO Project VALUES (6, 'Document Topic Modeling', DATE '2026-05-02', DATE '2026-01-20');

INSERT INTO PhaseComplexity VALUES ('Data Collection', 2);
INSERT INTO PhaseComplexity VALUES ('Preprocessing', 3);
INSERT INTO PhaseComplexity VALUES ('Training', 5);
INSERT INTO PhaseComplexity VALUES ('Evaluation', 3);
INSERT INTO PhaseComplexity VALUES ('Deployment', 4);

INSERT INTO Phase VALUES ('Data Collection', 1, 10, 'Collect housing and sales data');
INSERT INTO Phase VALUES ('Preprocessing', 1, 14, 'Clean missing values and scale features');
INSERT INTO Phase VALUES ('Training', 1, 20, 'Train regression models');
INSERT INTO Phase VALUES ('Evaluation', 1, 8, 'Evaluate MAE and R2');

INSERT INTO Phase VALUES ('Data Collection', 2, 8, 'Gather customer churn records');
INSERT INTO Phase VALUES ('Preprocessing', 2, 12, 'Balance classes and normalize data');
INSERT INTO Phase VALUES ('Training', 2, 18, 'Train classification models');
INSERT INTO Phase VALUES ('Evaluation', 2, 9, 'Compare accuracy and F1');

INSERT INTO Phase VALUES ('Data Collection', 3, 7, 'Collect image embeddings');
INSERT INTO Phase VALUES ('Preprocessing', 3, 10, 'Normalize clustering features');
INSERT INTO Phase VALUES ('Training', 3, 16, 'Run clustering algorithms');
INSERT INTO Phase VALUES ('Evaluation', 3, 7, 'Check silhouette scores');

INSERT INTO Phase VALUES ('Data Collection', 4, 9, 'Collect energy consumption history');
INSERT INTO Phase VALUES ('Preprocessing', 4, 13, 'Build forecasting features');
INSERT INTO Phase VALUES ('Training', 4, 17, 'Train forecasting models');
INSERT INTO Phase VALUES ('Evaluation', 4, 8, 'Evaluate MAE and RMSE');

INSERT INTO Phase VALUES ('Data Collection', 5, 11, 'Collect fraud transaction logs');
INSERT INTO Phase VALUES ('Preprocessing', 5, 15, 'Remove anomalies and encode features');
INSERT INTO Phase VALUES ('Training', 5, 21, 'Train fraud detection classifiers');
INSERT INTO Phase VALUES ('Evaluation', 5, 10, 'Evaluate precision and F1');

INSERT INTO Phase VALUES ('Data Collection', 6, 6, 'Collect text corpora');
INSERT INTO Phase VALUES ('Preprocessing', 6, 9, 'Convert documents to embeddings');
INSERT INTO Phase VALUES ('Training', 6, 14, 'Run topic clustering');
INSERT INTO Phase VALUES ('Evaluation', 6, 6, 'Evaluate topic coherence');

INSERT INTO Hyperparameter VALUES (1, 'learning_rate', '0.01', 'Y', 'FLOAT');
INSERT INTO Hyperparameter VALUES (2, 'batch_size', '32', 'Y', 'INTEGER');
INSERT INTO Hyperparameter VALUES (3, 'epochs', '10', 'Y', 'INTEGER');
INSERT INTO Hyperparameter VALUES (4, 'dropout', '0.2', 'N', 'FLOAT');
INSERT INTO Hyperparameter VALUES (5, 'max_depth', '5', 'N', 'INTEGER');
INSERT INTO Hyperparameter VALUES (6, 'decision_threshold', '0.5', 'N', 'FLOAT');
INSERT INTO Hyperparameter VALUES (7, 'num_clusters', '8', 'N', 'INTEGER');

INSERT INTO Dataset VALUES (1, 'CSV', 12000, 24, DATE '2026-01-01');
INSERT INTO Dataset VALUES (2, 'CSV', 18000, 31, DATE '2026-01-03');
INSERT INTO Dataset VALUES (3, 'PARQUET', 26000, 42, DATE '2026-01-05');
INSERT INTO Dataset VALUES (4, 'IMAGES', 9000, 128, DATE '2026-01-07');
INSERT INTO Dataset VALUES (5, 'CSV', 21000, 18, DATE '2026-01-09');
INSERT INTO Dataset VALUES (6, 'JSON', 15000, 36, DATE '2026-01-11');

INSERT INTO HardwareConfiguration VALUES (1, 'RX 7900', 8, 16);
INSERT INTO HardwareConfiguration VALUES (2, 'NVIDIA H100', 16, 32);
INSERT INTO HardwareConfiguration VALUES (3, 'NVIDIA A100', 32, 64);
INSERT INTO HardwareConfiguration VALUES (4, 'RTX 4090', 24, 128);
INSERT INTO HardwareConfiguration VALUES (5, 'RTX 5090', 32, 256);

INSERT INTO Model VALUES (1, '/models/reg_house_v1', 'MODEL', 1000);
INSERT INTO Model VALUES (2, '/models/reg_house_v2', 'MODEL', 1100);
INSERT INTO Model VALUES (3, '/models/forecast_v1', 'MODEL', 1200);
INSERT INTO Model VALUES (4, '/models/churn_cls_v1', 'MODEL', 1300);
INSERT INTO Model VALUES (5, '/models/churn_cls_v2', 'MODEL', 1400);
INSERT INTO Model VALUES (6, '/models/fraud_cls_v1', 'MODEL', 1500);
INSERT INTO Model VALUES (7, '/models/image_clust_v1', 'MODEL', 1600);
INSERT INTO Model VALUES (8, '/models/image_clust_v2', 'MODEL', 1700);
INSERT INTO Model VALUES (9, '/models/topic_clust_v1', 'MODEL', 1800);

INSERT INTO Regression VALUES (1, 'log');
INSERT INTO Regression VALUES (2, 'none');
INSERT INTO Regression VALUES (3, 'standardize');

INSERT INTO Classification VALUES (4, 0.50);
INSERT INTO Classification VALUES (5, 0.55);
INSERT INTO Classification VALUES (6, 0.60);

INSERT INTO Clustering VALUES (7, 'K-Means');
INSERT INTO Clustering VALUES (8, 'DBSCAN');
INSERT INTO Clustering VALUES (9, 'Hierarchical');

INSERT INTO Creates VALUES ('mark@email.com', 1);
INSERT INTO Creates VALUES ('adi@email.com', 1);
INSERT INTO Creates VALUES ('chaitanya@email.com', 2);
INSERT INTO Creates VALUES ('adi@email.com', 2);
INSERT INTO Creates VALUES ('john@email.com', 3);
INSERT INTO Creates VALUES ('bob@email.com', 3);
INSERT INTO Creates VALUES ('adi@email.com', 4);
INSERT INTO Creates VALUES ('frank@email.com', 4);
INSERT INTO Creates VALUES ('john@email.com', 5);
INSERT INTO Creates VALUES ('chaitanya@email.com', 5);
INSERT INTO Creates VALUES ('bob@email.com', 6);

INSERT INTO Run VALUES (1, TIMESTAMP '2026-01-15 09:00:00', TIMESTAMP '2026-01-15 09:45:00', 'COMPLETED', 1, 1, 1, 1);
INSERT INTO Run VALUES (2, TIMESTAMP '2026-01-16 10:00:00', TIMESTAMP '2026-01-16 10:50:00', 'COMPLETED', 1, 2, 2, 2);
INSERT INTO Run VALUES (3, TIMESTAMP '2026-01-17 11:00:00', TIMESTAMP '2026-01-17 11:40:00', 'COMPLETED', 2, 4, 2, 2);
INSERT INTO Run VALUES (4, TIMESTAMP '2026-01-17 12:00:00', TIMESTAMP '2026-01-17 15:40:00', 'COMPLETED', 2, 4, 2, 2);
INSERT INTO Run VALUES (5, TIMESTAMP '2026-01-26 12:00:00', TIMESTAMP '2026-01-26 12:47:00', 'COMPLETED', 2, 2, 2, 2);
INSERT INTO Run VALUES (6, TIMESTAMP '2026-01-18 11:30:00', TIMESTAMP '2026-01-18 12:05:00', 'FAILED', 2, 5, 3, 3);
INSERT INTO Run VALUES (7, TIMESTAMP '2026-01-19 13:00:00', TIMESTAMP '2026-01-19 13:48:00', 'COMPLETED', 3, 7, 4, 1);
INSERT INTO Run VALUES (8, TIMESTAMP '2026-01-20 14:10:00', NULL, 'RUNNING', 3, 8, 4, 4);
INSERT INTO Run VALUES (9, TIMESTAMP '2026-01-21 09:15:00', TIMESTAMP '2026-01-21 10:05:00', 'COMPLETED', 4, 3, 5, 3);
INSERT INTO Run VALUES (10, TIMESTAMP '2026-01-22 15:00:00', TIMESTAMP '2026-01-22 15:42:00', 'COMPLETED', 5, 6, 3, 2);
INSERT INTO Run VALUES (11, TIMESTAMP '2026-01-23 16:05:00', TIMESTAMP '2026-01-23 16:56:00', 'COMPLETED', 5, 4, 6, 4);
INSERT INTO Run VALUES (12, TIMESTAMP '2026-01-24 08:35:00', TIMESTAMP '2026-01-24 09:20:00', 'FAILED', 6, 9, 6, 1);
INSERT INTO Run VALUES (13, TIMESTAMP '2026-01-25 10:20:00', TIMESTAMP '2026-01-25 11:05:00', 'COMPLETED', 4, 1, 5, 5);
INSERT INTO Run VALUES (14, TIMESTAMP '2026-01-24 08:35:00', TIMESTAMP '2026-01-26 12:47:00', 'COMPLETED', 2, 3, 3, 2);


INSERT INTO Uses VALUES (1, 1, '0.010');
INSERT INTO Uses VALUES (1, 2, '32');
INSERT INTO Uses VALUES (1, 3, '12');
INSERT INTO Uses VALUES (1, 4, '0.15');

INSERT INTO Uses VALUES (2, 1, '0.008');
INSERT INTO Uses VALUES (2, 2, '64');
INSERT INTO Uses VALUES (2, 3, '16');
INSERT INTO Uses VALUES (2, 4, '0.20');
INSERT INTO Uses VALUES (2, 5, '8');

INSERT INTO Uses VALUES (3, 1, '0.005');
INSERT INTO Uses VALUES (3, 2, '128');
INSERT INTO Uses VALUES (3, 3, '10');
INSERT INTO Uses VALUES (3, 6, '0.50');

INSERT INTO Uses VALUES (4, 1, '0.003');
INSERT INTO Uses VALUES (4, 2, '64');
INSERT INTO Uses VALUES (4, 6, '0.55');

INSERT INTO Uses VALUES (5, 2, '32');
INSERT INTO Uses VALUES (5, 3, '20');
INSERT INTO Uses VALUES (5, 7, '6');

INSERT INTO Uses VALUES (6, 1, '0.020');
INSERT INTO Uses VALUES (6, 2, '32');
INSERT INTO Uses VALUES (6, 3, '15');
INSERT INTO Uses VALUES (6, 7, '8');

INSERT INTO Uses VALUES (7, 1, '0.006');
INSERT INTO Uses VALUES (7, 3, '18');
INSERT INTO Uses VALUES (7, 5, '10');

INSERT INTO Uses VALUES (8, 1, '0.002');
INSERT INTO Uses VALUES (8, 2, '256');
INSERT INTO Uses VALUES (8, 3, '8');
INSERT INTO Uses VALUES (8, 6, '0.62');

INSERT INTO Uses VALUES (9, 1, '0.004');
INSERT INTO Uses VALUES (9, 2, '128');
INSERT INTO Uses VALUES (9, 3, '14');
INSERT INTO Uses VALUES (9, 4, '0.10');
INSERT INTO Uses VALUES (9, 6, '0.58');

INSERT INTO Uses VALUES (10, 2, '64');
INSERT INTO Uses VALUES (10, 3, '9');
INSERT INTO Uses VALUES (10, 7, '12');

INSERT INTO Uses VALUES (11, 1, '0.007');
INSERT INTO Uses VALUES (11, 2, '32');
INSERT INTO Uses VALUES (11, 3, '14');
INSERT INTO Uses VALUES (11, 5, '7');

INSERT INTO Uses VALUES (12, 1, '0.009');
INSERT INTO Uses VALUES (12, 2, '48');
INSERT INTO Uses VALUES (12, 3, '11');
INSERT INTO Uses VALUES (12, 7, '10');

INSERT INTO MetricType VALUES ('mae', 'score', 'MIN', 0, 100);
INSERT INTO MetricType VALUES ('mse', 'score', 'MIN', 0, 1000);
INSERT INTO MetricType VALUES ('rmse', 'score', 'MIN', 0, 100);
INSERT INTO MetricType VALUES ('r2', 'score', 'MAX', 0, 1);
INSERT INTO MetricType VALUES ('loss', 'score', 'MIN', 0, 100);
INSERT INTO MetricType VALUES ('accuracy', 'score', 'MAX', 0, 1);
INSERT INTO MetricType VALUES ('f1', 'score', 'MAX', 0, 1);
INSERT INTO MetricType VALUES ('silhouette', 'score', 'MAX', -1, 1);

INSERT INTO Metric VALUES (1, 'mae', 1, 8.9);
INSERT INTO Metric VALUES (2, 'mse', 1, 70.0);
INSERT INTO Metric VALUES (3, 'rmse', 1, 8.4);
INSERT INTO Metric VALUES (4, 'r2', 1, 0.81);
INSERT INTO Metric VALUES (5, 'loss', 1, 0.35);

INSERT INTO Metric VALUES (6, 'mae', 2, 7.8);
INSERT INTO Metric VALUES (7, 'mse', 2, 62.0);
INSERT INTO Metric VALUES (8, 'rmse', 2, 7.9);
INSERT INTO Metric VALUES (9, 'r2', 2, 0.84);
INSERT INTO Metric VALUES (10, 'loss', 2, 0.28);

INSERT INTO Metric VALUES (11, 'accuracy', 3, 0.89);
INSERT INTO Metric VALUES (12, 'f1', 3, 0.86);
INSERT INTO Metric VALUES (13, 'loss', 3, 0.42);

INSERT INTO Metric VALUES (14, 'accuracy', 4, 0.76);
INSERT INTO Metric VALUES (15, 'f1', 4, 0.72);
INSERT INTO Metric VALUES (16, 'loss', 4, 0.95);

INSERT INTO Metric VALUES (17, 'silhouette', 5, 0.61);
INSERT INTO Metric VALUES (18, 'loss', 5, 0.33);

INSERT INTO Metric VALUES (19, 'accuracy', 6, 0.91);
INSERT INTO Metric VALUES (20, 'f1', 6, 0.90);
INSERT INTO Metric VALUES (21, 'loss', 6, 0.27);

INSERT INTO Metric VALUES (22, 'mae', 7, 6.8);
INSERT INTO Metric VALUES (23, 'mse', 7, 55.0);
INSERT INTO Metric VALUES (24, 'rmse', 7, 7.4);
INSERT INTO Metric VALUES (25, 'r2', 7, 0.88);
INSERT INTO Metric VALUES (26, 'loss', 7, 0.22);

INSERT INTO Metric VALUES (27, 'accuracy', 8, 0.87);
INSERT INTO Metric VALUES (28, 'f1', 8, 0.84);
INSERT INTO Metric VALUES (29, 'loss', 8, 0.31);

INSERT INTO Metric VALUES (30, 'accuracy', 9, 0.93);
INSERT INTO Metric VALUES (31, 'f1', 9, 0.91);
INSERT INTO Metric VALUES (32, 'loss', 9, 0.24);

INSERT INTO Metric VALUES (33, 'silhouette', 10, 0.58);
INSERT INTO Metric VALUES (34, 'loss', 10, 0.49);

INSERT INTO Metric VALUES (35, 'mae', 11, 6.3);
INSERT INTO Metric VALUES (36, 'mse', 11, 49.0);
INSERT INTO Metric VALUES (37, 'rmse', 11, 7.0);
INSERT INTO Metric VALUES (38, 'r2', 11, 0.90);
INSERT INTO Metric VALUES (39, 'loss', 11, 0.20);

INSERT INTO Metric VALUES (40, 'silhouette', 12, 0.66);
INSERT INTO Metric VALUES (41, 'loss', 12, 0.29);

COMMIT;