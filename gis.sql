-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 11, 2025 at 03:00 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gis`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('geodingis-cache-livewire-rate-limiter:a17961fa74e9275d529f489537f179c05d50c2f3', 'i:1;', 1765417522),
('geodingis-cache-livewire-rate-limiter:a17961fa74e9275d529f489537f179c05d50c2f3:timer', 'i:1765417522;', 1765417522),
('geodingis-cache-spatie.permission.cache', 'a:3:{s:5:\"alias\";a:4:{s:1:\"a\";s:2:\"id\";s:1:\"b\";s:4:\"name\";s:1:\"c\";s:10:\"guard_name\";s:1:\"r\";s:5:\"roles\";}s:11:\"permissions\";a:120:{i:0;a:4:{s:1:\"a\";i:1;s:1:\"b\";s:17:\"view-any Category\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:1;a:3:{s:1:\"a\";i:2;s:1:\"b\";s:17:\"view-any Category\";s:1:\"c\";s:3:\"api\";}i:2;a:4:{s:1:\"a\";i:3;s:1:\"b\";s:13:\"view Category\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:3;a:3:{s:1:\"a\";i:4;s:1:\"b\";s:13:\"view Category\";s:1:\"c\";s:3:\"api\";}i:4;a:4:{s:1:\"a\";i:5;s:1:\"b\";s:15:\"create Category\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:5;a:3:{s:1:\"a\";i:6;s:1:\"b\";s:15:\"create Category\";s:1:\"c\";s:3:\"api\";}i:6;a:4:{s:1:\"a\";i:7;s:1:\"b\";s:15:\"update Category\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:7;a:3:{s:1:\"a\";i:8;s:1:\"b\";s:15:\"update Category\";s:1:\"c\";s:3:\"api\";}i:8;a:4:{s:1:\"a\";i:9;s:1:\"b\";s:15:\"delete Category\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:9;a:3:{s:1:\"a\";i:10;s:1:\"b\";s:15:\"delete Category\";s:1:\"c\";s:3:\"api\";}i:10;a:4:{s:1:\"a\";i:11;s:1:\"b\";s:19:\"delete-any Category\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:11;a:3:{s:1:\"a\";i:12;s:1:\"b\";s:19:\"delete-any Category\";s:1:\"c\";s:3:\"api\";}i:12;a:3:{s:1:\"a\";i:13;s:1:\"b\";s:18:\"replicate Category\";s:1:\"c\";s:3:\"web\";}i:13;a:3:{s:1:\"a\";i:14;s:1:\"b\";s:18:\"replicate Category\";s:1:\"c\";s:3:\"api\";}i:14;a:3:{s:1:\"a\";i:15;s:1:\"b\";s:16:\"restore Category\";s:1:\"c\";s:3:\"web\";}i:15;a:3:{s:1:\"a\";i:16;s:1:\"b\";s:16:\"restore Category\";s:1:\"c\";s:3:\"api\";}i:16;a:3:{s:1:\"a\";i:17;s:1:\"b\";s:20:\"restore-any Category\";s:1:\"c\";s:3:\"web\";}i:17;a:3:{s:1:\"a\";i:18;s:1:\"b\";s:20:\"restore-any Category\";s:1:\"c\";s:3:\"api\";}i:18;a:3:{s:1:\"a\";i:19;s:1:\"b\";s:16:\"reorder Category\";s:1:\"c\";s:3:\"web\";}i:19;a:3:{s:1:\"a\";i:20;s:1:\"b\";s:16:\"reorder Category\";s:1:\"c\";s:3:\"api\";}i:20;a:3:{s:1:\"a\";i:21;s:1:\"b\";s:21:\"force-delete Category\";s:1:\"c\";s:3:\"web\";}i:21;a:3:{s:1:\"a\";i:22;s:1:\"b\";s:21:\"force-delete Category\";s:1:\"c\";s:3:\"api\";}i:22;a:3:{s:1:\"a\";i:23;s:1:\"b\";s:25:\"force-delete-any Category\";s:1:\"c\";s:3:\"web\";}i:23;a:3:{s:1:\"a\";i:24;s:1:\"b\";s:25:\"force-delete-any Category\";s:1:\"c\";s:3:\"api\";}i:24;a:4:{s:1:\"a\";i:25;s:1:\"b\";s:13:\"view-any Spot\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:25;a:3:{s:1:\"a\";i:26;s:1:\"b\";s:13:\"view-any Spot\";s:1:\"c\";s:3:\"api\";}i:26;a:4:{s:1:\"a\";i:27;s:1:\"b\";s:9:\"view Spot\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:27;a:3:{s:1:\"a\";i:28;s:1:\"b\";s:9:\"view Spot\";s:1:\"c\";s:3:\"api\";}i:28;a:4:{s:1:\"a\";i:29;s:1:\"b\";s:11:\"create Spot\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:29;a:3:{s:1:\"a\";i:30;s:1:\"b\";s:11:\"create Spot\";s:1:\"c\";s:3:\"api\";}i:30;a:4:{s:1:\"a\";i:31;s:1:\"b\";s:11:\"update Spot\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:31;a:3:{s:1:\"a\";i:32;s:1:\"b\";s:11:\"update Spot\";s:1:\"c\";s:3:\"api\";}i:32;a:4:{s:1:\"a\";i:33;s:1:\"b\";s:11:\"delete Spot\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:33;a:3:{s:1:\"a\";i:34;s:1:\"b\";s:11:\"delete Spot\";s:1:\"c\";s:3:\"api\";}i:34;a:4:{s:1:\"a\";i:35;s:1:\"b\";s:15:\"delete-any Spot\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:35;a:3:{s:1:\"a\";i:36;s:1:\"b\";s:15:\"delete-any Spot\";s:1:\"c\";s:3:\"api\";}i:36;a:3:{s:1:\"a\";i:37;s:1:\"b\";s:14:\"replicate Spot\";s:1:\"c\";s:3:\"web\";}i:37;a:3:{s:1:\"a\";i:38;s:1:\"b\";s:14:\"replicate Spot\";s:1:\"c\";s:3:\"api\";}i:38;a:3:{s:1:\"a\";i:39;s:1:\"b\";s:12:\"restore Spot\";s:1:\"c\";s:3:\"web\";}i:39;a:3:{s:1:\"a\";i:40;s:1:\"b\";s:12:\"restore Spot\";s:1:\"c\";s:3:\"api\";}i:40;a:3:{s:1:\"a\";i:41;s:1:\"b\";s:16:\"restore-any Spot\";s:1:\"c\";s:3:\"web\";}i:41;a:3:{s:1:\"a\";i:42;s:1:\"b\";s:16:\"restore-any Spot\";s:1:\"c\";s:3:\"api\";}i:42;a:3:{s:1:\"a\";i:43;s:1:\"b\";s:12:\"reorder Spot\";s:1:\"c\";s:3:\"web\";}i:43;a:3:{s:1:\"a\";i:44;s:1:\"b\";s:12:\"reorder Spot\";s:1:\"c\";s:3:\"api\";}i:44;a:3:{s:1:\"a\";i:45;s:1:\"b\";s:17:\"force-delete Spot\";s:1:\"c\";s:3:\"web\";}i:45;a:3:{s:1:\"a\";i:46;s:1:\"b\";s:17:\"force-delete Spot\";s:1:\"c\";s:3:\"api\";}i:46;a:3:{s:1:\"a\";i:47;s:1:\"b\";s:21:\"force-delete-any Spot\";s:1:\"c\";s:3:\"web\";}i:47;a:3:{s:1:\"a\";i:48;s:1:\"b\";s:21:\"force-delete-any Spot\";s:1:\"c\";s:3:\"api\";}i:48;a:4:{s:1:\"a\";i:49;s:1:\"b\";s:23:\"view-any SpotPermission\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:49;a:3:{s:1:\"a\";i:50;s:1:\"b\";s:23:\"view-any SpotPermission\";s:1:\"c\";s:3:\"api\";}i:50;a:4:{s:1:\"a\";i:51;s:1:\"b\";s:19:\"view SpotPermission\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:51;a:3:{s:1:\"a\";i:52;s:1:\"b\";s:19:\"view SpotPermission\";s:1:\"c\";s:3:\"api\";}i:52;a:4:{s:1:\"a\";i:53;s:1:\"b\";s:21:\"create SpotPermission\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:53;a:3:{s:1:\"a\";i:54;s:1:\"b\";s:21:\"create SpotPermission\";s:1:\"c\";s:3:\"api\";}i:54;a:4:{s:1:\"a\";i:55;s:1:\"b\";s:21:\"update SpotPermission\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:55;a:3:{s:1:\"a\";i:56;s:1:\"b\";s:21:\"update SpotPermission\";s:1:\"c\";s:3:\"api\";}i:56;a:4:{s:1:\"a\";i:57;s:1:\"b\";s:21:\"delete SpotPermission\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:57;a:3:{s:1:\"a\";i:58;s:1:\"b\";s:21:\"delete SpotPermission\";s:1:\"c\";s:3:\"api\";}i:58;a:4:{s:1:\"a\";i:59;s:1:\"b\";s:25:\"delete-any SpotPermission\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:59;a:3:{s:1:\"a\";i:60;s:1:\"b\";s:25:\"delete-any SpotPermission\";s:1:\"c\";s:3:\"api\";}i:60;a:3:{s:1:\"a\";i:61;s:1:\"b\";s:24:\"replicate SpotPermission\";s:1:\"c\";s:3:\"web\";}i:61;a:3:{s:1:\"a\";i:62;s:1:\"b\";s:24:\"replicate SpotPermission\";s:1:\"c\";s:3:\"api\";}i:62;a:3:{s:1:\"a\";i:63;s:1:\"b\";s:22:\"restore SpotPermission\";s:1:\"c\";s:3:\"web\";}i:63;a:3:{s:1:\"a\";i:64;s:1:\"b\";s:22:\"restore SpotPermission\";s:1:\"c\";s:3:\"api\";}i:64;a:3:{s:1:\"a\";i:65;s:1:\"b\";s:26:\"restore-any SpotPermission\";s:1:\"c\";s:3:\"web\";}i:65;a:3:{s:1:\"a\";i:66;s:1:\"b\";s:26:\"restore-any SpotPermission\";s:1:\"c\";s:3:\"api\";}i:66;a:3:{s:1:\"a\";i:67;s:1:\"b\";s:22:\"reorder SpotPermission\";s:1:\"c\";s:3:\"web\";}i:67;a:3:{s:1:\"a\";i:68;s:1:\"b\";s:22:\"reorder SpotPermission\";s:1:\"c\";s:3:\"api\";}i:68;a:3:{s:1:\"a\";i:69;s:1:\"b\";s:27:\"force-delete SpotPermission\";s:1:\"c\";s:3:\"web\";}i:69;a:3:{s:1:\"a\";i:70;s:1:\"b\";s:27:\"force-delete SpotPermission\";s:1:\"c\";s:3:\"api\";}i:70;a:3:{s:1:\"a\";i:71;s:1:\"b\";s:31:\"force-delete-any SpotPermission\";s:1:\"c\";s:3:\"web\";}i:71;a:3:{s:1:\"a\";i:72;s:1:\"b\";s:31:\"force-delete-any SpotPermission\";s:1:\"c\";s:3:\"api\";}i:72;a:4:{s:1:\"a\";i:73;s:1:\"b\";s:20:\"view-any SpotStorage\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:73;a:3:{s:1:\"a\";i:74;s:1:\"b\";s:20:\"view-any SpotStorage\";s:1:\"c\";s:3:\"api\";}i:74;a:4:{s:1:\"a\";i:75;s:1:\"b\";s:16:\"view SpotStorage\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:75;a:3:{s:1:\"a\";i:76;s:1:\"b\";s:16:\"view SpotStorage\";s:1:\"c\";s:3:\"api\";}i:76;a:4:{s:1:\"a\";i:77;s:1:\"b\";s:18:\"create SpotStorage\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:77;a:3:{s:1:\"a\";i:78;s:1:\"b\";s:18:\"create SpotStorage\";s:1:\"c\";s:3:\"api\";}i:78;a:4:{s:1:\"a\";i:79;s:1:\"b\";s:18:\"update SpotStorage\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:79;a:3:{s:1:\"a\";i:80;s:1:\"b\";s:18:\"update SpotStorage\";s:1:\"c\";s:3:\"api\";}i:80;a:4:{s:1:\"a\";i:81;s:1:\"b\";s:18:\"delete SpotStorage\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:81;a:3:{s:1:\"a\";i:82;s:1:\"b\";s:18:\"delete SpotStorage\";s:1:\"c\";s:3:\"api\";}i:82;a:4:{s:1:\"a\";i:83;s:1:\"b\";s:22:\"delete-any SpotStorage\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:83;a:3:{s:1:\"a\";i:84;s:1:\"b\";s:22:\"delete-any SpotStorage\";s:1:\"c\";s:3:\"api\";}i:84;a:3:{s:1:\"a\";i:85;s:1:\"b\";s:21:\"replicate SpotStorage\";s:1:\"c\";s:3:\"web\";}i:85;a:3:{s:1:\"a\";i:86;s:1:\"b\";s:21:\"replicate SpotStorage\";s:1:\"c\";s:3:\"api\";}i:86;a:3:{s:1:\"a\";i:87;s:1:\"b\";s:19:\"restore SpotStorage\";s:1:\"c\";s:3:\"web\";}i:87;a:3:{s:1:\"a\";i:88;s:1:\"b\";s:19:\"restore SpotStorage\";s:1:\"c\";s:3:\"api\";}i:88;a:3:{s:1:\"a\";i:89;s:1:\"b\";s:23:\"restore-any SpotStorage\";s:1:\"c\";s:3:\"web\";}i:89;a:3:{s:1:\"a\";i:90;s:1:\"b\";s:23:\"restore-any SpotStorage\";s:1:\"c\";s:3:\"api\";}i:90;a:3:{s:1:\"a\";i:91;s:1:\"b\";s:19:\"reorder SpotStorage\";s:1:\"c\";s:3:\"web\";}i:91;a:3:{s:1:\"a\";i:92;s:1:\"b\";s:19:\"reorder SpotStorage\";s:1:\"c\";s:3:\"api\";}i:92;a:3:{s:1:\"a\";i:93;s:1:\"b\";s:24:\"force-delete SpotStorage\";s:1:\"c\";s:3:\"web\";}i:93;a:3:{s:1:\"a\";i:94;s:1:\"b\";s:24:\"force-delete SpotStorage\";s:1:\"c\";s:3:\"api\";}i:94;a:3:{s:1:\"a\";i:95;s:1:\"b\";s:28:\"force-delete-any SpotStorage\";s:1:\"c\";s:3:\"web\";}i:95;a:3:{s:1:\"a\";i:96;s:1:\"b\";s:28:\"force-delete-any SpotStorage\";s:1:\"c\";s:3:\"api\";}i:96;a:4:{s:1:\"a\";i:97;s:1:\"b\";s:13:\"view-any User\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:97;a:3:{s:1:\"a\";i:98;s:1:\"b\";s:13:\"view-any User\";s:1:\"c\";s:3:\"api\";}i:98;a:4:{s:1:\"a\";i:99;s:1:\"b\";s:9:\"view User\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:99;a:3:{s:1:\"a\";i:100;s:1:\"b\";s:9:\"view User\";s:1:\"c\";s:3:\"api\";}i:100;a:4:{s:1:\"a\";i:101;s:1:\"b\";s:11:\"create User\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:101;a:3:{s:1:\"a\";i:102;s:1:\"b\";s:11:\"create User\";s:1:\"c\";s:3:\"api\";}i:102;a:4:{s:1:\"a\";i:103;s:1:\"b\";s:11:\"update User\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:103;a:3:{s:1:\"a\";i:104;s:1:\"b\";s:11:\"update User\";s:1:\"c\";s:3:\"api\";}i:104;a:4:{s:1:\"a\";i:105;s:1:\"b\";s:11:\"delete User\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:105;a:3:{s:1:\"a\";i:106;s:1:\"b\";s:11:\"delete User\";s:1:\"c\";s:3:\"api\";}i:106;a:3:{s:1:\"a\";i:107;s:1:\"b\";s:15:\"delete-any User\";s:1:\"c\";s:3:\"web\";}i:107;a:3:{s:1:\"a\";i:108;s:1:\"b\";s:15:\"delete-any User\";s:1:\"c\";s:3:\"api\";}i:108;a:3:{s:1:\"a\";i:109;s:1:\"b\";s:14:\"replicate User\";s:1:\"c\";s:3:\"web\";}i:109;a:3:{s:1:\"a\";i:110;s:1:\"b\";s:14:\"replicate User\";s:1:\"c\";s:3:\"api\";}i:110;a:3:{s:1:\"a\";i:111;s:1:\"b\";s:12:\"restore User\";s:1:\"c\";s:3:\"web\";}i:111;a:3:{s:1:\"a\";i:112;s:1:\"b\";s:12:\"restore User\";s:1:\"c\";s:3:\"api\";}i:112;a:3:{s:1:\"a\";i:113;s:1:\"b\";s:16:\"restore-any User\";s:1:\"c\";s:3:\"web\";}i:113;a:3:{s:1:\"a\";i:114;s:1:\"b\";s:16:\"restore-any User\";s:1:\"c\";s:3:\"api\";}i:114;a:3:{s:1:\"a\";i:115;s:1:\"b\";s:12:\"reorder User\";s:1:\"c\";s:3:\"web\";}i:115;a:3:{s:1:\"a\";i:116;s:1:\"b\";s:12:\"reorder User\";s:1:\"c\";s:3:\"api\";}i:116;a:3:{s:1:\"a\";i:117;s:1:\"b\";s:17:\"force-delete User\";s:1:\"c\";s:3:\"web\";}i:117;a:3:{s:1:\"a\";i:118;s:1:\"b\";s:17:\"force-delete User\";s:1:\"c\";s:3:\"api\";}i:118;a:3:{s:1:\"a\";i:119;s:1:\"b\";s:21:\"force-delete-any User\";s:1:\"c\";s:3:\"web\";}i:119;a:3:{s:1:\"a\";i:120;s:1:\"b\";s:21:\"force-delete-any User\";s:1:\"c\";s:3:\"api\";}}s:5:\"roles\";a:2:{i:0;a:3:{s:1:\"a\";i:1;s:1:\"b\";s:5:\"admin\";s:1:\"c\";s:3:\"web\";}i:1;a:3:{s:1:\"a\";i:2;s:1:\"b\";s:4:\"user\";s:1:\"c\";s:3:\"web\";}}}', 1765449858);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `type` varchar(255) NOT NULL,
  `color` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `icon`, `type`, `color`, `is_active`, `created_at`, `updated_at`) VALUES
(2, 'seismic', 'seismic', NULL, 'seismic', '#f52c2c', 1, '2025-12-09 01:13:08', '2025-12-10 17:36:16'),
(3, 'well', 'well', NULL, 'well', '#edd019', 1, '2025-12-10 00:03:17', '2025-12-10 00:03:17'),
(4, 'Basin', 'Basin', NULL, 'Basin', '#6b5e5e', 1, '2025-12-10 00:13:46', '2025-12-10 00:13:46');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_12_09_034535_create_categories_table', 1),
(5, '2025_12_09_034535_create_spot_storages_table', 1),
(6, '2025_12_09_034535_create_spots_table', 1),
(7, '2025_12_09_034906_create_spots_permisson_table', 1),
(8, '2025_12_10_025141_create_permission_tables', 2),
(9, '2025_12_10_080040_add_is_active_to_categories_table', 3),
(10, '2025_12_10_080154_add_is_active_to_spot_storages_table', 3),
(11, '2025_12_10_080514_add_is_active_to_spots_table', 3),
(12, '2025_12_10_080917_add_can_access_to_spots_permission_table', 4);

-- --------------------------------------------------------

--
-- Table structure for table `model_has_permissions`
--

CREATE TABLE `model_has_permissions` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `model_has_roles`
--

CREATE TABLE `model_has_roles` (
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `model_has_roles`
--

INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES
(1, 'App\\Models\\User', 1),
(2, 'App\\Models\\User', 2);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(1, 'view-any Category', 'web', '2025-12-09 20:10:01', '2025-12-09 20:10:01'),
(2, 'view-any Category', 'api', '2025-12-09 20:10:01', '2025-12-09 20:10:01'),
(3, 'view Category', 'web', '2025-12-09 20:10:01', '2025-12-09 20:10:01'),
(4, 'view Category', 'api', '2025-12-09 20:10:01', '2025-12-09 20:10:01'),
(5, 'create Category', 'web', '2025-12-09 20:10:01', '2025-12-09 20:10:01'),
(6, 'create Category', 'api', '2025-12-09 20:10:01', '2025-12-09 20:10:01'),
(7, 'update Category', 'web', '2025-12-09 20:10:01', '2025-12-09 20:10:01'),
(8, 'update Category', 'api', '2025-12-09 20:10:01', '2025-12-09 20:10:01'),
(9, 'delete Category', 'web', '2025-12-09 20:10:01', '2025-12-09 20:10:01'),
(10, 'delete Category', 'api', '2025-12-09 20:10:01', '2025-12-09 20:10:01'),
(11, 'delete-any Category', 'web', '2025-12-09 20:10:01', '2025-12-09 20:10:01'),
(12, 'delete-any Category', 'api', '2025-12-09 20:10:01', '2025-12-09 20:10:01'),
(13, 'replicate Category', 'web', '2025-12-09 20:10:01', '2025-12-09 20:10:01'),
(14, 'replicate Category', 'api', '2025-12-09 20:10:01', '2025-12-09 20:10:01'),
(15, 'restore Category', 'web', '2025-12-09 20:10:01', '2025-12-09 20:10:01'),
(16, 'restore Category', 'api', '2025-12-09 20:10:01', '2025-12-09 20:10:01'),
(17, 'restore-any Category', 'web', '2025-12-09 20:10:01', '2025-12-09 20:10:01'),
(18, 'restore-any Category', 'api', '2025-12-09 20:10:01', '2025-12-09 20:10:01'),
(19, 'reorder Category', 'web', '2025-12-09 20:10:01', '2025-12-09 20:10:01'),
(20, 'reorder Category', 'api', '2025-12-09 20:10:01', '2025-12-09 20:10:01'),
(21, 'force-delete Category', 'web', '2025-12-09 20:10:01', '2025-12-09 20:10:01'),
(22, 'force-delete Category', 'api', '2025-12-09 20:10:01', '2025-12-09 20:10:01'),
(23, 'force-delete-any Category', 'web', '2025-12-09 20:10:01', '2025-12-09 20:10:01'),
(24, 'force-delete-any Category', 'api', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(25, 'view-any Spot', 'web', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(26, 'view-any Spot', 'api', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(27, 'view Spot', 'web', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(28, 'view Spot', 'api', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(29, 'create Spot', 'web', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(30, 'create Spot', 'api', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(31, 'update Spot', 'web', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(32, 'update Spot', 'api', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(33, 'delete Spot', 'web', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(34, 'delete Spot', 'api', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(35, 'delete-any Spot', 'web', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(36, 'delete-any Spot', 'api', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(37, 'replicate Spot', 'web', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(38, 'replicate Spot', 'api', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(39, 'restore Spot', 'web', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(40, 'restore Spot', 'api', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(41, 'restore-any Spot', 'web', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(42, 'restore-any Spot', 'api', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(43, 'reorder Spot', 'web', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(44, 'reorder Spot', 'api', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(45, 'force-delete Spot', 'web', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(46, 'force-delete Spot', 'api', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(47, 'force-delete-any Spot', 'web', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(48, 'force-delete-any Spot', 'api', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(49, 'view-any SpotPermission', 'web', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(50, 'view-any SpotPermission', 'api', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(51, 'view SpotPermission', 'web', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(52, 'view SpotPermission', 'api', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(53, 'create SpotPermission', 'web', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(54, 'create SpotPermission', 'api', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(55, 'update SpotPermission', 'web', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(56, 'update SpotPermission', 'api', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(57, 'delete SpotPermission', 'web', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(58, 'delete SpotPermission', 'api', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(59, 'delete-any SpotPermission', 'web', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(60, 'delete-any SpotPermission', 'api', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(61, 'replicate SpotPermission', 'web', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(62, 'replicate SpotPermission', 'api', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(63, 'restore SpotPermission', 'web', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(64, 'restore SpotPermission', 'api', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(65, 'restore-any SpotPermission', 'web', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(66, 'restore-any SpotPermission', 'api', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(67, 'reorder SpotPermission', 'web', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(68, 'reorder SpotPermission', 'api', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(69, 'force-delete SpotPermission', 'web', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(70, 'force-delete SpotPermission', 'api', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(71, 'force-delete-any SpotPermission', 'web', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(72, 'force-delete-any SpotPermission', 'api', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(73, 'view-any SpotStorage', 'web', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(74, 'view-any SpotStorage', 'api', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(75, 'view SpotStorage', 'web', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(76, 'view SpotStorage', 'api', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(77, 'create SpotStorage', 'web', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(78, 'create SpotStorage', 'api', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(79, 'update SpotStorage', 'web', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(80, 'update SpotStorage', 'api', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(81, 'delete SpotStorage', 'web', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(82, 'delete SpotStorage', 'api', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(83, 'delete-any SpotStorage', 'web', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(84, 'delete-any SpotStorage', 'api', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(85, 'replicate SpotStorage', 'web', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(86, 'replicate SpotStorage', 'api', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(87, 'restore SpotStorage', 'web', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(88, 'restore SpotStorage', 'api', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(89, 'restore-any SpotStorage', 'web', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(90, 'restore-any SpotStorage', 'api', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(91, 'reorder SpotStorage', 'web', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(92, 'reorder SpotStorage', 'api', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(93, 'force-delete SpotStorage', 'web', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(94, 'force-delete SpotStorage', 'api', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(95, 'force-delete-any SpotStorage', 'web', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(96, 'force-delete-any SpotStorage', 'api', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(97, 'view-any User', 'web', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(98, 'view-any User', 'api', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(99, 'view User', 'web', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(100, 'view User', 'api', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(101, 'create User', 'web', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(102, 'create User', 'api', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(103, 'update User', 'web', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(104, 'update User', 'api', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(105, 'delete User', 'web', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(106, 'delete User', 'api', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(107, 'delete-any User', 'web', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(108, 'delete-any User', 'api', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(109, 'replicate User', 'web', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(110, 'replicate User', 'api', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(111, 'restore User', 'web', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(112, 'restore User', 'api', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(113, 'restore-any User', 'web', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(114, 'restore-any User', 'api', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(115, 'reorder User', 'web', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(116, 'reorder User', 'api', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(117, 'force-delete User', 'web', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(118, 'force-delete User', 'api', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(119, 'force-delete-any User', 'web', '2025-12-09 20:10:02', '2025-12-09 20:10:02'),
(120, 'force-delete-any User', 'api', '2025-12-09 20:10:02', '2025-12-09 20:10:02');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'web', '2025-12-09 19:56:02', '2025-12-09 19:56:02'),
(2, 'user', 'web', '2025-12-09 19:56:42', '2025-12-09 19:56:42');

-- --------------------------------------------------------

--
-- Table structure for table `role_has_permissions`
--

CREATE TABLE `role_has_permissions` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role_has_permissions`
--

INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES
(1, 1),
(1, 2),
(3, 1),
(3, 2),
(5, 1),
(7, 1),
(9, 1),
(11, 1),
(25, 1),
(25, 2),
(27, 1),
(27, 2),
(29, 1),
(31, 1),
(33, 1),
(35, 1),
(49, 1),
(51, 1),
(53, 1),
(55, 1),
(57, 1),
(59, 1),
(73, 1),
(73, 2),
(75, 1),
(75, 2),
(77, 1),
(79, 1),
(81, 1),
(83, 1),
(97, 1),
(99, 1),
(101, 1),
(103, 1),
(105, 1);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('7Cl9Ja48ff4vxprQddhOLiNVaKzPDjLp8GskcbhR', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoia1ZCSVEyQ3RxRVhuZ3MzN1EyN1pHbVFZOXZnQkJSdmJDT3RtcFFibSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9kYWhzYm9hcmQvbG9naW4iO3M6NToicm91dGUiO3M6MjU6ImZpbGFtZW50LmFkbWluLmF1dGgubG9naW4iO319', 1765418395);

-- --------------------------------------------------------

--
-- Table structure for table `spots`
--

CREATE TABLE `spots` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `geojson_file` varchar(255) NOT NULL,
  `category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `spot_storage_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `spots`
--

INSERT INTO `spots` (`id`, `name`, `slug`, `geojson_file`, `category_id`, `spot_storage_id`, `created_at`, `updated_at`, `is_active`) VALUES
(10, 'seismic', 'seismic', 'geojson_files/01KC12SHFP76AXXADXQ7D3HHN2.geojson', 2, 1, '2025-12-09 00:36:31', '2025-12-09 01:14:07', 1),
(11, '1 seismic', '1-seismic', 'geojson_files/01KC14XRPR5SBTMTCNNWACRNHN.geojson', 2, 1, '2025-12-09 01:51:22', '2025-12-09 01:51:22', 1),
(12, 'basin ina', 'basin-ina', 'geojson_files/01KC39QRJKJJY39VGY3A5G2YJ8.geojson', 4, 1, '2025-12-09 21:53:57', '2025-12-10 00:14:09', 1),
(13, 'well indonesia', 'well-indonesia', 'geojson_files/01KC3HAM5HDYADR8Q7VNFVVP9J.geojson', 3, 1, '2025-12-10 00:04:55', '2025-12-10 00:06:36', 1),
(14, 'East Natuna', 'east-natuna', 'geojson_files/01KC3J78Z88H72HCY68ZYYV0M2.geojson', 2, 1, '2025-12-10 00:22:15', '2025-12-10 00:22:15', 1);

-- --------------------------------------------------------

--
-- Table structure for table `spots_permisson`
--

CREATE TABLE `spots_permisson` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `spot_id` bigint(20) UNSIGNED NOT NULL,
  `can_access` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `spots_permisson`
--

INSERT INTO `spots_permisson` (`id`, `user_id`, `spot_id`, `can_access`, `created_at`, `updated_at`) VALUES
(3, 1, 12, 1, '2025-12-10 01:53:34', '2025-12-10 01:53:34'),
(5, 1, 11, 1, '2025-12-10 03:47:19', '2025-12-10 03:47:19'),
(6, 1, 14, 1, '2025-12-10 03:47:24', '2025-12-10 03:47:24'),
(7, 1, 10, 1, '2025-12-10 03:47:29', '2025-12-10 03:47:29'),
(8, 1, 13, 1, '2025-12-10 03:47:38', '2025-12-10 03:47:38'),
(9, 2, 11, 1, '2025-12-10 03:47:57', '2025-12-10 03:47:57'),
(10, 2, 13, 1, '2025-12-10 03:48:04', '2025-12-10 18:40:20'),
(11, 2, 14, 1, '2025-12-10 03:48:10', '2025-12-10 18:40:24');

-- --------------------------------------------------------

--
-- Table structure for table `spot_storages`
--

CREATE TABLE `spot_storages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `path` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `spot_storages`
--

INSERT INTO `spot_storages` (`id`, `name`, `slug`, `path`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'hardisk a', 'hardisk-a', 'D>Data', 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Luthfi', 'admin@gmail.com', NULL, '$2y$12$J1BDNPtOE1QVELHvbWv9QOH.gaiyq/IqenomskuT4JXwElomcKLB.', 'Gm2erQSg9MB75lb1tgizpYvCNt2syJLGWEJbqmbRtCsz6SghMMzMkNYIEDbP', '2025-12-08 21:06:40', '2025-12-10 18:46:10'),
(2, 'user', 'user@gmail.com', NULL, '$2y$12$ls5GEcw5kXCPcigli1FGru/gBG9iNfTtOGnpeMpgi5YFPbLqmF3uG', NULL, '2025-12-09 20:23:03', '2025-12-09 20:23:03');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  ADD KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Indexes for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  ADD KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`);

--
-- Indexes for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`role_id`),
  ADD KEY `role_has_permissions_role_id_foreign` (`role_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `spots`
--
ALTER TABLE `spots`
  ADD PRIMARY KEY (`id`),
  ADD KEY `spots_category_id_foreign` (`category_id`),
  ADD KEY `spots_spot_storage_id_foreign` (`spot_storage_id`);

--
-- Indexes for table `spots_permisson`
--
ALTER TABLE `spots_permisson`
  ADD PRIMARY KEY (`id`),
  ADD KEY `spots_permisson_user_id_foreign` (`user_id`),
  ADD KEY `spots_permisson_spot_id_foreign` (`spot_id`);

--
-- Indexes for table `spot_storages`
--
ALTER TABLE `spot_storages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=122;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `spots`
--
ALTER TABLE `spots`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `spots_permisson`
--
ALTER TABLE `spots_permisson`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `spot_storages`
--
ALTER TABLE `spot_storages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `spots`
--
ALTER TABLE `spots`
  ADD CONSTRAINT `spots_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `spots_spot_storage_id_foreign` FOREIGN KEY (`spot_storage_id`) REFERENCES `spot_storages` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `spots_permisson`
--
ALTER TABLE `spots_permisson`
  ADD CONSTRAINT `spots_permisson_spot_id_foreign` FOREIGN KEY (`spot_id`) REFERENCES `spots` (`id`),
  ADD CONSTRAINT `spots_permisson_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
