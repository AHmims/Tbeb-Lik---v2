-- ---EXECUTER CETTER PARTIE APPARTIR DE "root"
create database tbeblikDBv2;
use tbeblikDBv2;

create user 'tbeblikAdmin'@'localhost';
alter user 'tbeblikAdmin'@'localhost' IDENTIFIED BY 't2b0e2b0l5i1kadmin';
grant ALL on tbeblikDBv2.* to 'tbeblikAdmin'@'localhost';

set global log_bin_trust_function_creators=1;

-- ------
/* */
-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le :  lun. 27 avr. 2020 à 01:06
-- Version du serveur :  5.7.26
-- Version de PHP :  7.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `bd_TELemedecinev1`
--

-- --------------------------------------------------------

--
-- Structure de la table `admin`
--

DROP TABLE IF EXISTS `admin`;
CREATE TABLE IF NOT EXISTS `admin` (
  `ID_ADMIN` int(11) NOT NULL,
  `EMAIL` char(250) DEFAULT NULL,
  `PASSWORD` char(250) DEFAULT NULL,
  PRIMARY KEY (`ID_ADMIN`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `admin`
--

INSERT INTO `admin` (`ID_ADMIN`, `EMAIL`, `PASSWORD`) VALUES
(1, 'admin@gmail.com', '123456');

-- --------------------------------------------------------

--
-- Structure de la table `medecin`
--

DROP TABLE IF EXISTS `medecin`;
CREATE TABLE IF NOT EXISTS `medecin` (
  `MATRICULE_MED` char(250) NOT NULL,
  `ID_SPEC` int(11) NOT NULL,
  `ID_ADMIN` int(11) NOT NULL,
  `NOM_MED` char(250) DEFAULT NULL,
  `TEL` char(250) DEFAULT NULL,
  `EMAIL` char(250) DEFAULT NULL,
  `DISPONIBLE` tinyint(1) DEFAULT NULL,
  `VILLE` char(250) DEFAULT NULL,
  `PASSWORD` char(250) DEFAULT NULL,
  PRIMARY KEY (`Matricule_Med`),
  KEY `FK_AJOUTER` (`ID_ADMIN`),
  KEY `FK_CONTIENT` (`ID_SPEC`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `medecin`
--

INSERT INTO `medecin` (`MATRICULE_MED`, `ID_SPEC`, `ID_ADMIN`, `NOM_MED`, `TEL`, `EMAIL`, `DISPONIBLE`, `VILLE`, `PASSWORD`) VALUES
('bh150', 2, 1, 'Mohamed Elmehdi Choukri', '0614075409', 'medelmehdi.choukri@gmail.com', 1, 'Safi', '123456'),
('bh151', 2, 1, 'Kamili Zakaria', '0666663614', 'Zakaria@gmail.com', 1, 'Safi', '123456');

-- --------------------------------------------------------

--
-- Structure de la table `message`
--

DROP TABLE IF EXISTS `message`;
CREATE TABLE IF NOT EXISTS `message` (
  `ID_MESSAGE` int(11) auto_increment,
  `MATRICULE_EMETTEUR` char(250) NOT NULL,
  `CONTENU` text,
  `ID_ROOM` char(250) DEFAULT NULL,
  `DATE_ENVOI` datetime DEFAULT NULL,
  `TYPE` text,
  `ID_PIECEJOINTES` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID_MESSAGE`),
  KEY `FK_CONSULTATION3` (`ID_ROOM`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `patient`
--

DROP TABLE IF EXISTS `patient`;
CREATE TABLE IF NOT EXISTS `patient` (
  `CIN` char(250) DEFAULT NULL,
  `MATRICULE_PAT` char(250) NOT NULL,
  `NOM_PAT` char(250) DEFAULT NULL,
  `PRENOM_PAT` char(250) DEFAULT NULL,
  `PASSWORD` char(250) DEFAULT NULL,
  `DATE_EMB` date DEFAULT NULL,
  `DATE_NAISSENCE` date DEFAULT NULL,
  `TEL` char(250) DEFAULT NULL,
  `ADRESSE` char(250) DEFAULT NULL,
  `DATE_RETRAIT` date DEFAULT NULL,
  `DIRECTION` char(250) DEFAULT NULL,
  `SEXE` char(250) DEFAULT NULL,
  PRIMARY KEY (`MATRICULE_PAT`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `patient`
--

INSERT INTO `patient` (`CIN`, `MATRICULE_PAT`, `NOM_PAT`, `PRENOM_PAT`, `PASSWORD`, `DATE_EMB`, `DATE_NAISSENCE`, `TEL`, `ADRESSE`, `DATE_RETRAIT`, `DIRECTION`, `SEXE`) VALUES
('HH112313', 'BH82982', 'Chraiki', 'Mohammed', '123456', '2014-06-07', '1995-02-26', '0614075409', '173 safi II', '2048-06-06', 'FIT', 'Homme'),
('HH112300', 'BH82900', 'Chaloumi', 'Fadwa', '123456', '2014-06-07', '1985-02-26', '0614075409', 'Plateau', '2048-06-06', 'FIT', 'Femme'),
('HH112301', 'BH82901', 'Filali', 'Hamza', '123456', '2014-06-07', '1956-02-26', '0614075409', 'Saada', '2048-06-06', 'FIT', 'Homme'),
('HH112302', 'BH82902', 'Kamal', 'Said', '123456', '2014-06-07', '1972-02-26', '0614075409', '173 safi II', '2048-06-06', 'FIT', 'Homme'),
('HH112303', 'BH82903', 'Adelane', 'Imane', '123456', '2014-06-07', '1988-02-26', '0614075409', 'Azib darri', '2048-06-06', 'FIT', 'Femme'),
('HH112304', 'BH82904', 'Yezza', 'Asmae', '123456', '2014-06-07', '1968-02-26', '0614075409', '173 safi II', '2048-06-06', 'FIT', 'Femme');

-- --------------------------------------------------------
DROP TABLE IF EXISTS `preConsultation`;
CREATE TABLE IF NOT EXISTS `preConsultation` (
	`ID_PRECONS` char(250) not null,
	`DATE_CREATION` datetime default now(),
	`MOTIF` text,
	`ATCD` text,
	`NB_JOUR_A` int(11) NOT NULL,
  `ACCEPTE` boolean default false,
	`MATRICULE_PAT` char(250) NOT NULL,
	PRIMARY KEY (`ID_PRECONS`),
	KEY `FK_CONSULTATION2` (`MATRICULE_PAT`)
);

drop trigger if exists assignNotifId;
DELIMITER //
CREATE TRIGGER assignNotifId
BEFORE INSERT
ON `preConsultation` FOR EACH ROW
BEGIN
	SET NEW.ID_PRECONS = CONCAT('NOTIF-',(SELECT FLOOR(RAND()*(1000000-2))+1));
    SET NEW.DATE_CREATION = now();
END;//
DELIMITER ;
-- --------------------------------------------------------

--
-- Structure de la table `consultation`
--

DROP TABLE IF EXISTS `consultation`;
CREATE TABLE IF NOT EXISTS `consultation` (
	`JOUR_REPOS` int(11) DEFAULT -1,
	`DATE_CONSULTATION` datetime NOT NULL,
	`MATRICULE_MED` char(250) NOT NULL,
  `COMMENTAIRE` text,
	`ID_PRECONS` char(250) NOT NULL,
	KEY `FK_CONSULTATION` (`MATRICULE_MED`),
	KEY `FK_CONTIENT3` (`ID_PRECONS`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- -----------------------------------

DROP TABLE IF EXISTS `room`;
CREATE TABLE IF NOT EXISTS `room` (
  `ID_ROOM` char(250) NOT NULL,
  `MATRICULE_PAT` char(250) NOT NULL,
  `MATRICULE_MED` char(250) DEFAULT NULL,
  PRIMARY KEY (`ID_ROOM`),
  KEY `FK_LINK1` (`MATRICULE_PAT`),
  KEY `FK_LINK2` (`MATRICULE_MED`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------
--
-- Structure de la table `room`
--
drop table if exists `appUser`;
create table if not exists `appUser` (
	`ID_USER` char(250) NOT NULL,
  `TYPE_USER` char(7) not null,
  `SOCKET` char(250) not null,
  `ONLINE` boolean,
  `MATRICULE_MED` char(250) default null,
  `ID_ROOM` char(250) default null,
  KEY `FK_LINK2` (`MATRICULE_MED`)
);

DELIMITER //
CREATE TRIGGER createRoom
BEFORE INSERT
ON `appUser` FOR EACH ROW
BEGIN
	DECLARE roomUniqueId varchar(250) default null;
	if new.TYPE_USER = 'Patient' then
		SET roomUniqueId = CONCAT('cRoom-',(SELECT FLOOR(RAND()*(100000-2))+1));
		SET new.ID_ROOM = roomUniqueId;
        -- ----
		insert into `room` (ID_ROOM,MATRICULE_PAT)
			values(new.ID_ROOM,new.ID_USER);
    end if;
END;//
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `specialites`
--

DROP TABLE IF EXISTS `specialites`;
CREATE TABLE IF NOT EXISTS `specialites` (
  `ID_SPEC` int(11) NOT NULL,
  `NOM_SPEC` char(250) DEFAULT NULL,
  PRIMARY KEY (`ID_SPEC`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `specialites`
--

INSERT INTO `specialites` (`ID_SPEC`, `NOM_SPEC`) VALUES
(1, 'Medecine génerale'),
(2, 'Cardiologie');

-- ----------------

DROP TABLE IF EXISTS `medecinInbox`;
CREATE TABLE IF NOT EXISTS `medecinInbox` (
	`ID_PRECONS` char(250) not null,
	`MATRICULE_MED` char(250) NOT NULL,
	KEY `FK_LINK1` (`ID_PRECONS`),
    KEY `FK_LINK2` (`MATRICULE_MED`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
