-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 05, 2026 at 06:02 PM
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
-- Database: `ebmag`
--

-- --------------------------------------------------------

--
-- Table structure for table `barangays`
--

CREATE TABLE `barangays` (
  `id` int(11) NOT NULL,
  `barangay` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `barangays`
--

INSERT INTO `barangays` (`id`, `barangay`) VALUES
(1, 'Alacaygan'),
(2, 'Alicante'),
(3, 'Batea'),
(4, 'Canlusong'),
(5, 'Consing'),
(6, 'Cudangdang'),
(7, 'Damgo'),
(8, 'Gahit'),
(9, 'Latasan'),
(10, 'Madalag'),
(11, 'Manta-angan'),
(12, 'Nanca'),
(13, 'Pasil'),
(14, 'Poblacion I (Barangay 1)'),
(15, 'Poblacion II (Barangay 2)'),
(16, 'Poblacion III (Barangay 3)'),
(17, 'San Isidro'),
(18, 'San Jose'),
(19, 'Santo Niño'),
(20, 'Tabigue'),
(21, 'Tanza'),
(22, 'Tomongtong'),
(23, 'Tuburan'),
(24, 'Test');

-- --------------------------------------------------------

--
-- Table structure for table `login_logs`
--

CREATE TABLE `login_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `login_logs`
--

INSERT INTO `login_logs` (`id`, `user_id`, `created_at`) VALUES
(1, 5, '2026-04-04 16:43:24'),
(2, 7, '2026-04-04 16:47:10'),
(3, 7, '2026-04-04 16:49:26'),
(4, 7, '2026-04-04 16:52:10'),
(5, 5, '2026-04-04 17:02:25'),
(6, 5, '2026-04-04 17:05:12'),
(7, 5, '2026-04-04 17:11:35'),
(8, 7, '2026-04-05 15:27:53'),
(9, 5, '2026-04-05 15:50:12'),
(10, 7, '2026-04-05 15:50:35'),
(11, 17, '2026-04-05 15:54:55'),
(12, 17, '2026-04-05 15:59:31'),
(13, 17, '2026-04-05 16:00:00'),
(14, 5, '2026-04-05 16:01:24');

-- --------------------------------------------------------

--
-- Table structure for table `puroks`
--

CREATE TABLE `puroks` (
  `id` int(11) NOT NULL,
  `barangay_id` int(11) NOT NULL,
  `purok` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `puroks`
--

INSERT INTO `puroks` (`id`, `barangay_id`, `purok`) VALUES
(1, 1, 'Alacaygan Example'),
(2, 2, 'Alicante Example'),
(3, 3, 'Batea Example'),
(4, 4, 'Canlusong Example'),
(5, 5, 'Consing Example'),
(6, 6, 'Cudangdang Example'),
(7, 7, 'Damgo Example'),
(8, 8, 'Gahit Example'),
(9, 9, 'Latasan Example'),
(10, 10, 'Madalag Example'),
(11, 11, 'Manta-angan Example'),
(12, 12, 'Nanca Example'),
(13, 13, 'Pasil Example'),
(14, 14, 'Poblacion I (Barangay 1) Example'),
(15, 15, 'Poblacion II (Barangay 2) Example'),
(16, 16, 'Poblacion III (Barangay 3) Example'),
(17, 17, 'San Isidro Example'),
(18, 18, 'San Jose Example'),
(19, 19, 'Santo Niño Example'),
(20, 20, 'Tabigue Example'),
(21, 21, 'Tanza Example'),
(22, 22, 'Tomongtong Example'),
(23, 23, 'Tuburan Example'),
(24, 24, 'Test Purok');

-- --------------------------------------------------------

--
-- Table structure for table `pwd`
--

CREATE TABLE `pwd` (
  `id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `middle_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) NOT NULL,
  `barangay` varchar(255) NOT NULL,
  `purok` varchar(255) NOT NULL,
  `birthday` date NOT NULL,
  `age` int(11) NOT NULL,
  `gender` enum('Male','Female','Other','Prefer not to say') NOT NULL,
  `place_of_birth` varchar(255) NOT NULL,
  `civil_status` enum('Single but Head of the Family','Single','Married') NOT NULL,
  `spouse_name` varchar(255) DEFAULT NULL,
  `fatherLastName` varchar(255) DEFAULT NULL,
  `fatherFirstName` varchar(255) DEFAULT NULL,
  `fatherMiddleName` varchar(255) DEFAULT NULL,
  `fatherExtension` varchar(50) DEFAULT NULL,
  `motherLastName` varchar(255) DEFAULT NULL,
  `motherFirstName` varchar(255) DEFAULT NULL,
  `motherMiddleName` varchar(255) DEFAULT NULL,
  `sss_id` varchar(100) DEFAULT NULL,
  `gsis_sss_no` varchar(100) DEFAULT NULL,
  `psn_no` varchar(100) DEFAULT NULL,
  `philhealth_no` varchar(100) DEFAULT NULL,
  `education_level` enum('Elementary Level','Elementary Graduate','High School Graduate','College Level','College Graduate','Post Graduate','Vocational','Not Attended School') NOT NULL,
  `employment_status` enum('Employee','Unemployed','Self-employed') NOT NULL,
  `employment_category` enum('Government','Private') DEFAULT NULL,
  `employment_type` enum('Permanent/Regular','Seasonal','Casual','Emergency') DEFAULT NULL,
  `disability_other_text` text DEFAULT NULL,
  `cause_other_text` text DEFAULT NULL,
  `status` enum('Active','Archived') DEFAULT 'Active',
  `archive_reason` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pwd`
--

INSERT INTO `pwd` (`id`, `first_name`, `middle_name`, `last_name`, `barangay`, `purok`, `birthday`, `age`, `gender`, `place_of_birth`, `civil_status`, `spouse_name`, `fatherLastName`, `fatherFirstName`, `fatherMiddleName`, `fatherExtension`, `motherLastName`, `motherFirstName`, `motherMiddleName`, `sss_id`, `gsis_sss_no`, `psn_no`, `philhealth_no`, `education_level`, `employment_status`, `employment_category`, `employment_type`, `disability_other_text`, `cause_other_text`, `status`, `archive_reason`, `created_at`, `updated_at`) VALUES
(4, 'EXAMPLES', 'EXAMPLE', 'EXAMPLE', 'Tomongtong', 'Tomongtong Example', '2000-06-02', 25, 'Male', 'EXAMPLE', 'Single', NULL, 'EXAMPLE', 'EXAMPLE', 'EXAMPLE', NULL, 'EXAMPLE', 'EXAMPLE', 'EXAMPLE', '', '', '', '', 'College Graduate', 'Employee', 'Private', 'Seasonal', NULL, NULL, 'Active', NULL, '2026-04-02 09:19:09', '2026-04-04 16:37:07'),
(5, 'ALI', 'C', 'ANTE', 'Alicante', 'Alicante Example', '2002-07-06', 23, 'Female', 'BACOLOD', 'Single', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'College Graduate', 'Employee', 'Private', 'Permanent/Regular', NULL, NULL, 'Active', NULL, '2026-04-05 16:01:05', '2026-04-05 16:01:05');

-- --------------------------------------------------------

--
-- Table structure for table `pwd_contacts`
--

CREATE TABLE `pwd_contacts` (
  `id` int(11) NOT NULL,
  `pwd_id` int(11) DEFAULT NULL,
  `type` enum('primary','secondary','emergency') DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `relationship` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pwd_contacts`
--

INSERT INTO `pwd_contacts` (`id`, `pwd_id`, `type`, `name`, `relationship`, `phone`, `email`) VALUES
(9, 4, 'primary', 'EXAMPLE', 'EXAMPLE', '09954417332', 'sql@gmail.com'),
(10, 5, 'primary', 'JAMIN PAUL SAPALO', 'RELATIONSHIP', '09954417332', 'Sapalojaminpaul@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `pwd_disabilities`
--

CREATE TABLE `pwd_disabilities` (
  `id` int(11) NOT NULL,
  `pwd_id` int(11) DEFAULT NULL,
  `disability` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pwd_disabilities`
--

INSERT INTO `pwd_disabilities` (`id`, `pwd_id`, `disability`) VALUES
(11, 4, 'Visual Disability'),
(12, 5, 'Visual Disability');

-- --------------------------------------------------------

--
-- Table structure for table `pwd_disability_causes`
--

CREATE TABLE `pwd_disability_causes` (
  `id` int(11) NOT NULL,
  `pwd_id` int(11) DEFAULT NULL,
  `cause` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pwd_disability_causes`
--

INSERT INTO `pwd_disability_causes` (`id`, `pwd_id`, `cause`) VALUES
(10, 4, 'Congenital / Inborn'),
(11, 5, 'Congenital / Inborn');

-- --------------------------------------------------------

--
-- Table structure for table `pwd_edit_logs`
--

CREATE TABLE `pwd_edit_logs` (
  `id` int(11) NOT NULL,
  `pwd_id` int(11) NOT NULL,
  `field` varchar(255) NOT NULL,
  `old_value` text DEFAULT NULL,
  `new_value` text DEFAULT NULL,
  `edited_by` varchar(255) DEFAULT NULL,
  `edited_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pwd_edit_logs`
--

INSERT INTO `pwd_edit_logs` (`id`, `pwd_id`, `field`, `old_value`, `new_value`, `edited_by`, `edited_at`) VALUES
(6, 4, 'first_name', 'EXAMPLE', 'EXAMPLES', 'staff_001@gmail.com', '2026-04-05 00:37:07');

-- --------------------------------------------------------

--
-- Table structure for table `senior_children`
--

CREATE TABLE `senior_children` (
  `id` int(11) NOT NULL,
  `senior_id` int(11) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `occupation` varchar(255) DEFAULT NULL,
  `income` varchar(100) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `working_status` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `senior_children`
--

INSERT INTO `senior_children` (`id`, `senior_id`, `full_name`, `occupation`, `income`, `age`, `working_status`) VALUES
(5, 11, 'JAMIN PAUL SAPALO', 'OCCUPATION CHILD', '1', 22, 'working');

-- --------------------------------------------------------

--
-- Table structure for table `senior_citizens`
--

CREATE TABLE `senior_citizens` (
  `id` int(11) NOT NULL,
  `reference_code` varchar(100) DEFAULT NULL,
  `last_name` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `middle_name` varchar(255) DEFAULT NULL,
  `extension` varchar(50) DEFAULT NULL,
  `barangay` varchar(255) NOT NULL,
  `purok` varchar(255) NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `age` int(11) NOT NULL,
  `marital_status` varchar(100) NOT NULL,
  `gender` varchar(50) NOT NULL,
  `osca_id_number` varchar(100) DEFAULT NULL,
  `gsis_sss` varchar(100) DEFAULT NULL,
  `philhealth` varchar(100) DEFAULT NULL,
  `sc_association_org_id_no` varchar(100) DEFAULT NULL,
  `tin` varchar(100) DEFAULT NULL,
  `other_govt_id` varchar(100) DEFAULT NULL,
  `service_business_employment` varchar(255) DEFAULT NULL,
  `current_pension` varchar(255) DEFAULT NULL,
  `capability_to_travel` varchar(255) DEFAULT NULL,
  `spouse_name` varchar(255) DEFAULT NULL,
  `father_last_name` varchar(255) DEFAULT NULL,
  `father_first_name` varchar(255) DEFAULT NULL,
  `father_middle_name` varchar(255) DEFAULT NULL,
  `father_extension` varchar(50) DEFAULT NULL,
  `mother_last_name` varchar(255) DEFAULT NULL,
  `mother_first_name` varchar(255) DEFAULT NULL,
  `mother_middle_name` varchar(255) DEFAULT NULL,
  `community_service_other_text` text DEFAULT NULL,
  `status` enum('Active','Archived') DEFAULT 'Active',
  `archive_reason` text DEFAULT NULL,
  `edited_by` varchar(255) DEFAULT NULL,
  `edited_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `place_of_birth` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `senior_citizens`
--

INSERT INTO `senior_citizens` (`id`, `reference_code`, `last_name`, `first_name`, `middle_name`, `extension`, `barangay`, `purok`, `date_of_birth`, `age`, `marital_status`, `gender`, `osca_id_number`, `gsis_sss`, `philhealth`, `sc_association_org_id_no`, `tin`, `other_govt_id`, `service_business_employment`, `current_pension`, `capability_to_travel`, `spouse_name`, `father_last_name`, `father_first_name`, `father_middle_name`, `father_extension`, `mother_last_name`, `mother_first_name`, `mother_middle_name`, `community_service_other_text`, `status`, `archive_reason`, `edited_by`, `edited_at`, `created_at`, `updated_at`, `place_of_birth`) VALUES
(11, NULL, 'SAPALO', 'JAMINS', 'PAUL', NULL, 'Consing', 'Consing Example', '1960-07-07', 65, 'Single', 'Male', NULL, NULL, NULL, NULL, NULL, NULL, 'AA', '10000', 'No', NULL, 'SAPALO', 'JAMIN', 'PAUL', NULL, 'SAPALO', 'JAMIN', 'PAUL', NULL, 'Active', NULL, 'staff_001@gmail.com', '2026-04-05 01:12:54', '2026-04-04 17:12:39', '2026-04-04 17:12:55', 'BACOLOD');

-- --------------------------------------------------------

--
-- Table structure for table `senior_community_services`
--

CREATE TABLE `senior_community_services` (
  `id` int(11) NOT NULL,
  `senior_id` int(11) DEFAULT NULL,
  `service` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `senior_community_services`
--

INSERT INTO `senior_community_services` (`id`, `senior_id`, `service`) VALUES
(9, 11, 'Community / Organization Leader');

-- --------------------------------------------------------

--
-- Table structure for table `senior_contacts`
--

CREATE TABLE `senior_contacts` (
  `id` int(11) NOT NULL,
  `senior_id` int(11) DEFAULT NULL,
  `type` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `relationship` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `email` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `senior_contacts`
--

INSERT INTO `senior_contacts` (`id`, `senior_id`, `type`, `name`, `relationship`, `phone`, `email`) VALUES
(17, 11, 'primary', 'JAMIN PAUL SAPALO', 'ME', '09954417332', 'Sapalojaminpaul@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `senior_edit_logs`
--

CREATE TABLE `senior_edit_logs` (
  `id` int(11) NOT NULL,
  `senior_id` int(11) DEFAULT NULL,
  `field` varchar(255) DEFAULT NULL,
  `old_value` text DEFAULT NULL,
  `new_value` text DEFAULT NULL,
  `edited_by` varchar(255) DEFAULT NULL,
  `edited_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `senior_edit_logs`
--

INSERT INTO `senior_edit_logs` (`id`, `senior_id`, `field`, `old_value`, `new_value`, `edited_by`, `edited_at`) VALUES
(15, 11, 'first_name', 'JAMIN', 'JAMINS', 'staff_001@gmail.com', '2026-04-05 01:12:54');

-- --------------------------------------------------------

--
-- Table structure for table `senior_education`
--

CREATE TABLE `senior_education` (
  `id` int(11) NOT NULL,
  `senior_id` int(11) DEFAULT NULL,
  `educational_attainment` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `senior_education`
--

INSERT INTO `senior_education` (`id`, `senior_id`, `educational_attainment`) VALUES
(8, 11, 'College Graduate');

-- --------------------------------------------------------

--
-- Table structure for table `senior_skills`
--

CREATE TABLE `senior_skills` (
  `id` int(11) NOT NULL,
  `senior_id` int(11) DEFAULT NULL,
  `skill` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `senior_skills`
--

INSERT INTO `senior_skills` (`id`, `senior_id`, `skill`) VALUES
(9, 11, 'Fishing');

-- --------------------------------------------------------

--
-- Table structure for table `sms_history`
--

CREATE TABLE `sms_history` (
  `id` int(11) NOT NULL,
  `recipient_type` enum('PWD','Youth','Senior') NOT NULL,
  `record_id` varchar(100) NOT NULL,
  `phone_number` varchar(50) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `middle_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) NOT NULL,
  `barangay` varchar(255) NOT NULL,
  `purok` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `status` enum('sent','error','skipped') NOT NULL,
  `sent_by` varchar(255) NOT NULL,
  `sent_at` datetime DEFAULT current_timestamp(),
  `received` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sms_history`
--

INSERT INTO `sms_history` (`id`, `recipient_type`, `record_id`, `phone_number`, `first_name`, `middle_name`, `last_name`, `barangay`, `purok`, `message`, `status`, `sent_by`, `sent_at`, `received`, `created_at`, `updated_at`) VALUES
(1, 'PWD', '2', '09954417332', 'SQLS', 'SQLS', 'SQLS', 'Barangay Rizal', 'Matagoy', 'SQL TEST', 'error', 'Unknown', '2026-03-20 16:58:09', 0, '2026-03-20 08:58:09', '2026-03-20 08:58:09');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('Admin','Staff','Super Admin','Barangay') NOT NULL,
  `status` enum('Active','Suspended','Inactive') DEFAULT 'Active',
  `barangay_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `status`, `barangay_id`) VALUES
(1, 'Charles Ivan C. Monserate', 'ivancharles389@gmail.com', '$2b$10$gjcaBz4HskYRXoS.dIZw1em0HL6spJzR4XA9l1poOEg/1Lbcueib6', 'Staff', 'Active', NULL),
(2, 'Monserate, Charles Ivan C.', 'admin@gmail.com', '$2b$10$ATcty0512XM8u8yU52FDeue.VtaLCG5qeKJqga5NPmMd7Ni8uqhMi', 'Admin', 'Active', NULL),
(3, 'CHARLES IVAN C. MONSERATE', 'monseratecharles@gmail.com', '$2b$10$NbPP7BjfxP3gltzghii9decUyZMNxu7f58b752b1PNOTlg7.FEz4y', 'Staff', 'Active', NULL),
(4, 'Jen Chome', 'jenchm@gmail.com', '$2b$10$f6.7.NBHSEygDBTWpYb4wOlus0PGaVIoPHSuuE0JBJPELnBxeo2QC', 'Admin', 'Active', NULL),
(5, 'IC', 'staff_001@gmail.com', '$2b$10$LXSyuvM/3JvjVxQihdEuxOUHA99QdJ37iMTGi6/xXg/G1YdK/KKza', 'Staff', 'Active', NULL),
(6, 'Jen', 'Admin_001@gmail.com', '$2b$10$PUm3UfFoBZKXmEr4HkxKR.PXhKMLNFgPYszoaGmXXqjIwss6IcqyC', 'Admin', 'Active', NULL),
(7, 'Thea', 'Superadmin_001@gmail.com', '$2b$10$1RPYTaeTw2BXSNgq5kBLOOkan2JM6objE6OZCQ1e4oA6O3e30HIbK', 'Super Admin', 'Active', NULL),
(10, 'Van Dough', 'Van@gmail.com', '$2b$10$qWyL/X90cXJxQmlLvEvrtetg.LiKuFleIE6HF3i27oI1JpIt0BIE.', 'Staff', 'Active', NULL),
(11, 'Angel Mae', 'angelmae@gmail.com', '$2b$10$ppGH9cGEf.NAqx2yHrdFNeztvyzk.W2BRyvIxLFCMnV7drdWublJ.', 'Staff', 'Active', NULL),
(12, 'Test Admin 1761679925602', 'testadmin1761679925602@gmail.com', '$2b$10$A5EwpsAnzEUQ.Po9gx2eB.u1Rir92lMgElyA0lAhhDtpY2RXrZCJa', 'Admin', 'Active', NULL),
(14, 'Test Staff 1761679946629', 'teststaff1761679946629@gmail.com', '$2b$10$SKgFUryGoNZQVVC.IT1cJ.c043DkCOuD.ggyUO.dBmOOVhXHqESje', 'Staff', 'Active', NULL),
(15, 'Test Admin 1761706590739', 'testadmin1761706590739@gmail.com', '$2b$10$tHt7VtL.YJeE.UV4ixiAqOV.N43Opqmk0tl7/4aPzvYPv1GmyqYGO', 'Admin', 'Active', NULL),
(16, 'Alysa Mae Dizon', 'chuchuu.chm@gmail.com', '$2b$10$WrPDeTXx7A.PEn.A32LvPeQpJVUaTAZAArZh1dwnmnjXt3LrUQ2bC', 'Staff', 'Inactive', NULL),
(17, 'Ali Cante', 'Alicante_001@gmail.com', '$2b$10$Wn7fNSnwnoDWQufgTiJ3aO6G9XRSsVkz9B8d56tIgXDCOHSdJtlwK', 'Barangay', 'Active', 2);

-- --------------------------------------------------------

--
-- Table structure for table `youth`
--

CREATE TABLE `youth` (
  `id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `middle_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) NOT NULL,
  `barangay` varchar(255) NOT NULL,
  `purok` varchar(255) NOT NULL,
  `contact` varchar(50) NOT NULL,
  `birthday` date NOT NULL,
  `age` int(11) NOT NULL,
  `gender` enum('Male','Female','Other','Prefer not to say') NOT NULL,
  `place_of_birth` varchar(255) NOT NULL,
  `education_level` enum('Elementary Level','Elementary Graduate','High School Graduate','College Level','College Graduate','Post Graduate','Vocational','Not Attended School') NOT NULL,
  `registered_sk` enum('Yes','No') NOT NULL,
  `voted_sk` enum('Yes','No') NOT NULL,
  `registered_national` enum('Yes','No') NOT NULL,
  `employment_status` enum('Employee','Unemployed','Self-employed') NOT NULL,
  `employment_category` enum('Government','Private') DEFAULT NULL,
  `employment_type` enum('Permanent/Regular','Seasonal','Casual','Emergency') DEFAULT NULL,
  `Assembly` enum('Yes','No') NOT NULL,
  `sk_times` enum('1-2','3-4','5+') DEFAULT NULL,
  `reason` enum('No KK Assembly Meeting','Not interested to attend') DEFAULT NULL,
  `youth_classification_other` text DEFAULT NULL,
  `youth_age_group_other` text DEFAULT NULL,
  `status` enum('Active','Archived') DEFAULT 'Active',
  `archive_reason` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `youth_age_groups`
--

CREATE TABLE `youth_age_groups` (
  `id` int(11) NOT NULL,
  `youth_id` int(11) DEFAULT NULL,
  `age_group` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `youth_classifications`
--

CREATE TABLE `youth_classifications` (
  `id` int(11) NOT NULL,
  `youth_id` int(11) DEFAULT NULL,
  `classification` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `youth_edit_logs`
--

CREATE TABLE `youth_edit_logs` (
  `id` int(11) NOT NULL,
  `youth_id` int(11) NOT NULL,
  `field` varchar(255) NOT NULL,
  `old_value` text DEFAULT NULL,
  `new_value` text DEFAULT NULL,
  `edited_by` varchar(255) DEFAULT NULL,
  `edited_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `barangays`
--
ALTER TABLE `barangays`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `login_logs`
--
ALTER TABLE `login_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_login_logs_user` (`user_id`);

--
-- Indexes for table `puroks`
--
ALTER TABLE `puroks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `barangay_id` (`barangay_id`);

--
-- Indexes for table `pwd`
--
ALTER TABLE `pwd`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pwd_contacts`
--
ALTER TABLE `pwd_contacts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pwd_id` (`pwd_id`);

--
-- Indexes for table `pwd_disabilities`
--
ALTER TABLE `pwd_disabilities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pwd_id` (`pwd_id`);

--
-- Indexes for table `pwd_disability_causes`
--
ALTER TABLE `pwd_disability_causes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pwd_id` (`pwd_id`);

--
-- Indexes for table `pwd_edit_logs`
--
ALTER TABLE `pwd_edit_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pwd_id` (`pwd_id`);

--
-- Indexes for table `senior_children`
--
ALTER TABLE `senior_children`
  ADD PRIMARY KEY (`id`),
  ADD KEY `senior_id` (`senior_id`);

--
-- Indexes for table `senior_citizens`
--
ALTER TABLE `senior_citizens`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `senior_community_services`
--
ALTER TABLE `senior_community_services`
  ADD PRIMARY KEY (`id`),
  ADD KEY `senior_id` (`senior_id`);

--
-- Indexes for table `senior_contacts`
--
ALTER TABLE `senior_contacts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `senior_id` (`senior_id`);

--
-- Indexes for table `senior_edit_logs`
--
ALTER TABLE `senior_edit_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `senior_id` (`senior_id`);

--
-- Indexes for table `senior_education`
--
ALTER TABLE `senior_education`
  ADD PRIMARY KEY (`id`),
  ADD KEY `senior_id` (`senior_id`);

--
-- Indexes for table `senior_skills`
--
ALTER TABLE `senior_skills`
  ADD PRIMARY KEY (`id`),
  ADD KEY `senior_id` (`senior_id`);

--
-- Indexes for table `sms_history`
--
ALTER TABLE `sms_history`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_users_barangay` (`barangay_id`);

--
-- Indexes for table `youth`
--
ALTER TABLE `youth`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `youth_age_groups`
--
ALTER TABLE `youth_age_groups`
  ADD PRIMARY KEY (`id`),
  ADD KEY `youth_id` (`youth_id`);

--
-- Indexes for table `youth_classifications`
--
ALTER TABLE `youth_classifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `youth_id` (`youth_id`);

--
-- Indexes for table `youth_edit_logs`
--
ALTER TABLE `youth_edit_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `youth_id` (`youth_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `barangays`
--
ALTER TABLE `barangays`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `login_logs`
--
ALTER TABLE `login_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `puroks`
--
ALTER TABLE `puroks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `pwd`
--
ALTER TABLE `pwd`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `pwd_contacts`
--
ALTER TABLE `pwd_contacts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `pwd_disabilities`
--
ALTER TABLE `pwd_disabilities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `pwd_disability_causes`
--
ALTER TABLE `pwd_disability_causes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `pwd_edit_logs`
--
ALTER TABLE `pwd_edit_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `senior_children`
--
ALTER TABLE `senior_children`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `senior_citizens`
--
ALTER TABLE `senior_citizens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `senior_community_services`
--
ALTER TABLE `senior_community_services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `senior_contacts`
--
ALTER TABLE `senior_contacts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `senior_edit_logs`
--
ALTER TABLE `senior_edit_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `senior_education`
--
ALTER TABLE `senior_education`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `senior_skills`
--
ALTER TABLE `senior_skills`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `sms_history`
--
ALTER TABLE `sms_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `youth`
--
ALTER TABLE `youth`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `youth_age_groups`
--
ALTER TABLE `youth_age_groups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `youth_classifications`
--
ALTER TABLE `youth_classifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `youth_edit_logs`
--
ALTER TABLE `youth_edit_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `login_logs`
--
ALTER TABLE `login_logs`
  ADD CONSTRAINT `fk_login_logs_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `puroks`
--
ALTER TABLE `puroks`
  ADD CONSTRAINT `puroks_ibfk_1` FOREIGN KEY (`barangay_id`) REFERENCES `barangays` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pwd_contacts`
--
ALTER TABLE `pwd_contacts`
  ADD CONSTRAINT `pwd_contacts_ibfk_1` FOREIGN KEY (`pwd_id`) REFERENCES `pwd` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pwd_disabilities`
--
ALTER TABLE `pwd_disabilities`
  ADD CONSTRAINT `pwd_disabilities_ibfk_1` FOREIGN KEY (`pwd_id`) REFERENCES `pwd` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pwd_disability_causes`
--
ALTER TABLE `pwd_disability_causes`
  ADD CONSTRAINT `pwd_disability_causes_ibfk_1` FOREIGN KEY (`pwd_id`) REFERENCES `pwd` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pwd_edit_logs`
--
ALTER TABLE `pwd_edit_logs`
  ADD CONSTRAINT `pwd_edit_logs_ibfk_1` FOREIGN KEY (`pwd_id`) REFERENCES `pwd` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `senior_children`
--
ALTER TABLE `senior_children`
  ADD CONSTRAINT `senior_children_ibfk_1` FOREIGN KEY (`senior_id`) REFERENCES `senior_citizens` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `senior_community_services`
--
ALTER TABLE `senior_community_services`
  ADD CONSTRAINT `senior_community_services_ibfk_1` FOREIGN KEY (`senior_id`) REFERENCES `senior_citizens` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `senior_contacts`
--
ALTER TABLE `senior_contacts`
  ADD CONSTRAINT `senior_contacts_ibfk_1` FOREIGN KEY (`senior_id`) REFERENCES `senior_citizens` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `senior_edit_logs`
--
ALTER TABLE `senior_edit_logs`
  ADD CONSTRAINT `senior_edit_logs_ibfk_1` FOREIGN KEY (`senior_id`) REFERENCES `senior_citizens` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `senior_education`
--
ALTER TABLE `senior_education`
  ADD CONSTRAINT `senior_education_ibfk_1` FOREIGN KEY (`senior_id`) REFERENCES `senior_citizens` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `senior_skills`
--
ALTER TABLE `senior_skills`
  ADD CONSTRAINT `senior_skills_ibfk_1` FOREIGN KEY (`senior_id`) REFERENCES `senior_citizens` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_users_barangay` FOREIGN KEY (`barangay_id`) REFERENCES `barangays` (`id`);

--
-- Constraints for table `youth_age_groups`
--
ALTER TABLE `youth_age_groups`
  ADD CONSTRAINT `youth_age_groups_ibfk_1` FOREIGN KEY (`youth_id`) REFERENCES `youth` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `youth_classifications`
--
ALTER TABLE `youth_classifications`
  ADD CONSTRAINT `youth_classifications_ibfk_1` FOREIGN KEY (`youth_id`) REFERENCES `youth` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `youth_edit_logs`
--
ALTER TABLE `youth_edit_logs`
  ADD CONSTRAINT `youth_edit_logs_ibfk_1` FOREIGN KEY (`youth_id`) REFERENCES `youth` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
