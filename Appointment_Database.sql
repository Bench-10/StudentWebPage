-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 29, 2024 at 11:51 PM
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
-- Database: `spc_appointments`
--

-- --------------------------------------------------------

--
-- Table structure for table `announcements`
--

CREATE TABLE `announcements` (
  `id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `content` text NOT NULL,
  `is_important` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `announcements`
--

INSERT INTO `announcements` (`id`, `title`, `content`, `is_important`, `created_at`, `updated_at`) VALUES
(5, 'hgh', 'gfh', 0, '2024-11-28 18:24:54', '2024-11-28 18:24:54'),
(8, 'fsdf', 'e3e3e', 1, '2024-11-29 01:05:06', '2024-11-29 01:05:06');

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` int(11) NOT NULL,
  `date_string` varchar(50) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `program` varchar(100) NOT NULL,
  `contact_number` varchar(20) NOT NULL,
  `year_level` varchar(20) NOT NULL,
  `documentation` text NOT NULL,
  `status` enum('pending','paid','missed') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `paid_date` datetime DEFAULT NULL,
  `expected_claim_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `date_string`, `full_name`, `program`, `contact_number`, `year_level`, `documentation`, `status`, `created_at`, `paid_date`, `expected_claim_date`) VALUES
(7, 'Fri Nov 29 2024', 'hedsd', 'dsadsd', '09074259948', '2nd year', 'Diploma (₱400.00)', 'paid', '2024-11-28 16:44:36', '2024-11-29 14:29:51', NULL),
(8, 'Fri Nov 29 2024', 'Micko Atienza Dela luna', 'dsadsd', '09074259948', '2nd year', 'Diploma (₱400.00), Certificate of Transfer Credentials (₱100.00)', 'paid', '2024-11-28 18:48:43', '2024-11-29 14:29:18', NULL),
(9, 'Sun Dec 01 2024', 'Micko Atienza Dela luna', 'dsadsd', '09074259948', '2nd year', 'Diploma (₱400.00)', 'paid', '2024-11-29 14:21:34', '2024-11-29 14:29:42', NULL),
(10, 'Fri Nov 29 2024', 'jyjyjy', 'dsadsd', '09074259948', '2nd year', 'Diploma (₱400.00), Certificate of Transfer Credentials (₱100.00)', 'paid', '2024-11-29 14:41:53', '2024-11-29 14:42:09', NULL),
(11, 'Fri Nov 29 2024', 'dsdsd', 'dsadsd', '09074259948', '2nd year', 'Diploma (₱400.00)', 'missed', '2024-11-29 14:52:14', NULL, NULL),
(12, 'Fri Nov 29 2024', 'dsdsd', 'dsadsd', '09074259948', '2nd year', 'Diploma (₱400.00), Certificate of Transfer Credentials (₱100.00), Form 137 (₱100.00), Transcript of Records (₱50.00 per page), Authentication (₱20.00 per page), Send Copy of Registration Form (₱15.00), Graduation Fee (₱1,000.00)', 'paid', '2024-11-29 15:08:31', '2024-11-29 15:10:09', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `announcements`
--
ALTER TABLE `announcements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
