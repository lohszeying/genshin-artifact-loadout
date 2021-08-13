DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Artifact;
DROP TYPE IF EXISTS artifact_types;

CREATE TYPE artifact_types AS ENUM ('FLOWER', 'FEATHER', 'SANDS', 'GOBLET', 'CIRCLET');

CREATE TABLE Users (
	username VARCHAR(64) PRIMARY KEY,
	password VARCHAR NOT NULL
);

CREATE TABLE Artifact (
	username VARCHAR(64) PRIMARY KEY,
	artifact_set_type VARCHAR(64) NOT NULL,
	artifact_type artifact_types NOT NULL,
	FOREIGN KEY (username) REFERENCES Users (username) ON UPDATE CASCADE
);
