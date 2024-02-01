-- Adminer 4.8.1 MySQL 8.0.31 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `funds`;
CREATE TABLE `funds` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fundId` varchar(50) NOT NULL,
  `fundCode` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `funds` (`id`, `fundId`, `fundCode`) VALUES
(1,	'H/SSXXXXXXXXELF',	'CPLIBSUAT1|8700201|526503|313U00'),
(2,	'H/SSXXXXXXXXPRF',	'CPLIBSUAT1|8700201|526503|313U00'),
(3,	'GENLTAXXXXXXOTF',	'CPLIBSUATU|8700201|526503|313U00'),
(4,	'HSCIMXXXXXXXPRF',	'CPLIBSUAT1|8700201|526503|313U00'),
(5,	'HSCIMXXXXXXXPRF',	'CPLIBSUAT1|8700201|526503|313U00'),
(6,	'H/SSXXXXXXXXELC',	'CPLIBSUAT1|8700201|526503|313U00'),
(7,	'H/SSHARRIBKXPRF',	'CPLIBSUAT1|8700201|526503|HARRIB'),
(8,	'H/SSHARRIBKXPRA',	'CPLIBSUAT1|8700201|526503|313U00'),
(9,	'H/SSHARRIBKXPRA',	'CPLIBSUAT1|8700201|526503|313U00'),
(10,	'BIOZXXXXXXXXPRA',	'CPLIBSUAT1|8700201|526503|313U00'),
(11,	'BIOZXXXXXXXXPRA',	'CPLIBSUAT1|8700201|526503|313U00'),
(12,	'GENLPOSTXXXXOTF',	'CPLIBSUATU|8700201|526503|313U00'),
(13,	'H/SSAPPYBPXXPRA',	'CPLIBSUATU|8700201|526503|313U00');

DROP TABLE IF EXISTS `invoices`;
CREATE TABLE `invoices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `invoicenumber` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `invoiceid` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `library` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `status` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `responsebody` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `datetime` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `invoices` (`id`, `invoicenumber`, `invoiceid`, `library`, `status`, `responsebody`, `datetime`) VALUES
(1,	'UAT_HEIN_0001',	'24289160100003126',	'LAW',	'NOT PAID',	'{\"invoiceId\":40022,\"vendorId\":300000020020370,\"vendorSiteId\":300000020595583,\"orgId\":300000007493069,\"poHeaderId\":null,\"supplierNumber\":\"5198\",\"supplierSiteCode\":\"DF PUR-5\",\"supplierName\":\"WILLIAM S HEIN & COMPANY INC\",\"supplierInvoiceNumber\":null,\"invoiceNumber\":\"UAT_HEIN_0001\",\"poNumber\":null,\"checkNumber\":null,\"paymentAmount\":100,\"invoiceDate\":\"2023-11-28\",\"paymentDate\":\"2023-11-30\",\"paymentStatusCode\":\"N\",\"paymentSourceName\":\"UCD GeneralLibrary\",\"checkStatusCode\":null,\"paymentMethodCode\":\"PAYMENT_PLUS\",\"batchName\":\"048e4718-3e33-4409-829a-0c038b278ae9\",\"lastUpdateDateTime\":\"2023-12-01T16:46:11.000Z\",\"lastUpdateUserId\":\"svc.BATCH\"}',	'2023-12-01 18:30:01'),
(2,	'UAT_HEIN_0002',	'24289161190003126',	'LAW',	'NOT PAID',	'{\"invoiceId\":41021,\"vendorId\":300000020020370,\"vendorSiteId\":300000020595583,\"orgId\":300000007493069,\"poHeaderId\":null,\"supplierNumber\":\"5198\",\"supplierSiteCode\":\"DF PUR-5\",\"supplierName\":\"WILLIAM S HEIN & COMPANY INC\",\"supplierInvoiceNumber\":null,\"invoiceNumber\":\"UAT_HEIN_0002\",\"poNumber\":null,\"checkNumber\":null,\"paymentAmount\":50,\"invoiceDate\":\"2023-11-28\",\"paymentDate\":\"2023-11-30\",\"paymentStatusCode\":\"N\",\"paymentSourceName\":\"UCD GeneralLibrary\",\"checkStatusCode\":null,\"paymentMethodCode\":\"PAYMENT_PLUS\",\"batchName\":\"66125a0c-d023-4076-9deb-fbf4c64644ab\",\"lastUpdateDateTime\":\"2023-12-01T16:46:10.000Z\",\"lastUpdateUserId\":\"svc.BATCH\"}',	'2023-12-01 18:30:01'),
(3,	'UAT_HEIN_0003',	'24289162320003126',	'LAW',	'NOT PAID',	'{\"invoiceId\":40023,\"vendorId\":300000020020370,\"vendorSiteId\":300000020595583,\"orgId\":300000007493069,\"poHeaderId\":null,\"supplierNumber\":\"5198\",\"supplierSiteCode\":\"DF PUR-5\",\"supplierName\":\"WILLIAM S HEIN & COMPANY INC\",\"supplierInvoiceNumber\":null,\"invoiceNumber\":\"UAT_HEIN_0003\",\"poNumber\":null,\"checkNumber\":null,\"paymentAmount\":75,\"invoiceDate\":\"2023-11-28\",\"paymentDate\":\"2023-11-30\",\"paymentStatusCode\":\"N\",\"paymentSourceName\":\"UCD GeneralLibrary\",\"checkStatusCode\":null,\"paymentMethodCode\":\"PAYMENT_PLUS\",\"batchName\":\"b7d72088-6151-444b-a66c-4c878887a4d6\",\"lastUpdateDateTime\":\"2023-12-01T16:46:10.000Z\",\"lastUpdateUserId\":\"svc.BATCH\"}',	'2023-12-01 18:30:01'),
(4,	'773529',	'24198761030003126',	'SHLDS',	'SENT',	'{\"scmInvoicePaymentCreate\":{\"requestStatus\":{\"requestId\":\"140b15c2-8e9d-42e2-8381-a2685ddeb25e\",\"consumerId\":\"UCD GeneralLibrary\",\"requestDateTime\":\"2023-12-05T21:57:47.043Z\",\"requestStatus\":\"PENDING\",\"operationName\":\"scmInvoicePaymentCreate\"},\"validationResults\":{\"errorMessages\":null,\"messageProperties\":null}}}',	'2023-12-05 21:46:37'),
(5,	'773528',	'24198763050003126',	'SHLDS',	'SENT',	'{\"scmInvoicePaymentCreate\":{\"requestStatus\":{\"requestId\":\"ae09ef51-8720-47d4-b756-d0bef1927204\",\"consumerId\":\"UCD GeneralLibrary\",\"requestDateTime\":\"2023-12-05T21:57:47.183Z\",\"requestStatus\":\"PENDING\",\"operationName\":\"scmInvoicePaymentCreate\"},\"validationResults\":{\"errorMessages\":null,\"messageProperties\":null}}}',	'2023-12-05 21:46:37'),
(6,	'776128',	'24228601530003126',	'SHLDS',	'SENT',	'{\"scmInvoicePaymentCreate\":{\"requestStatus\":{\"requestId\":\"8304203f-55e3-4eaa-aaf4-01cd61a299b3\",\"consumerId\":\"UCD GeneralLibrary\",\"requestDateTime\":\"2023-12-05T21:57:47.258Z\",\"requestStatus\":\"PENDING\",\"operationName\":\"scmInvoicePaymentCreate\"},\"validationResults\":{\"errorMessages\":null,\"messageProperties\":null}}}',	'2023-12-05 21:46:37'),
(7,	'GOBI_TEST_878235',	'24289149820003126',	'SHLDS',	'NOT PAID',	'{\"invoiceId\":41020,\"vendorId\":300000020040904,\"vendorSiteId\":300000020629276,\"orgId\":300000007493069,\"poHeaderId\":null,\"supplierNumber\":\"8563\",\"supplierSiteCode\":\"DF PAY-5\",\"supplierName\":\"YANKEE BOOK PEDDLER INC\",\"supplierInvoiceNumber\":null,\"invoiceNumber\":\"GOBI_TEST_878235\",\"poNumber\":null,\"checkNumber\":null,\"paymentAmount\":71.53,\"invoiceDate\":\"2023-11-15\",\"paymentDate\":\"2023-11-30\",\"paymentStatusCode\":\"N\",\"paymentSourceName\":\"UCD GeneralLibrary\",\"checkStatusCode\":null,\"paymentMethodCode\":\"CHK_WELLS_FARGO\",\"batchName\":\"eb06a09b-9ede-4d5e-ad6d-47ccc722aedb\",\"lastUpdateDateTime\":\"2023-12-01T16:46:11.000Z\",\"lastUpdateUserId\":\"svc.BATCH\"}',	'2023-12-05 19:30:21'),
(8,	'800225TEST',	'24285138720003126',	'SHLDS',	'NOT PAID',	'{\"invoiceId\":40021,\"vendorId\":300000020040904,\"vendorSiteId\":300000020629276,\"orgId\":300000007493069,\"poHeaderId\":null,\"supplierNumber\":\"8563\",\"supplierSiteCode\":\"DF PAY-5\",\"supplierName\":\"YANKEE BOOK PEDDLER INC\",\"supplierInvoiceNumber\":null,\"invoiceNumber\":\"800225TEST\",\"poNumber\":null,\"checkNumber\":null,\"paymentAmount\":100,\"invoiceDate\":\"2023-10-17\",\"paymentDate\":\"2023-11-30\",\"paymentStatusCode\":\"N\",\"paymentSourceName\":\"UCD GeneralLibrary\",\"checkStatusCode\":null,\"paymentMethodCode\":\"CHK_WELLS_FARGO\",\"batchName\":\"038ab5bd-4eb5-4e3d-af68-c6fbe0179daf\",\"lastUpdateDateTime\":\"2023-12-01T16:46:10.000Z\",\"lastUpdateUserId\":\"svc.BATCH\"}',	'2023-12-05 19:30:21'),
(9,	'793683TEST',	'24284759050003126',	'SHLDS',	'SENT',	'{\"scmInvoicePaymentCreate\":{\"requestStatus\":{\"requestId\":\"e89e98cd-75d6-4ea1-b4a0-c4391ef01d92\",\"consumerId\":\"UCD GeneralLibrary\",\"requestDateTime\":\"2023-12-05T22:06:47.107Z\",\"requestStatus\":\"PENDING\",\"operationName\":\"scmInvoicePaymentCreate\"},\"validationResults\":{\"errorMessages\":null,\"messageProperties\":null}}}',	'2023-12-05 22:04:46'),
(10,	'23-1103TEST',	'24284760320003126',	'SHLDS',	'NOT PAID',	'{\"invoiceId\":41012,\"vendorId\":300000020009191,\"vendorSiteId\":300000020597352,\"orgId\":300000007493069,\"poHeaderId\":null,\"supplierNumber\":\"38110\",\"supplierSiteCode\":\"DF PUR-7\",\"supplierName\":\"ROPER CENTER FOR PUBLIC OPINION RESEARCH INC\",\"supplierInvoiceNumber\":null,\"invoiceNumber\":\"23-1103TEST\",\"poNumber\":null,\"checkNumber\":null,\"paymentAmount\":8100,\"invoiceDate\":\"2023-09-01\",\"paymentDate\":\"2023-11-30\",\"paymentStatusCode\":\"N\",\"paymentSourceName\":\"UCD GeneralLibrary\",\"checkStatusCode\":null,\"paymentMethodCode\":\"UCD_PMX\",\"batchName\":\"b50e49dd-c2c0-4334-8ea7-236cacd5f7aa\",\"lastUpdateDateTime\":\"2023-12-01T16:46:10.000Z\",\"lastUpdateUserId\":\"svc.BATCH\"}',	'2023-12-05 19:30:21'),
(11,	'801846TEST',	'24284757850003126',	'SHLDS',	'SENT',	'{\"scmInvoicePaymentCreate\":{\"requestStatus\":{\"requestId\":\"b420feb8-e8e6-4a5c-aebc-d6fc7f97508b\",\"consumerId\":\"UCD GeneralLibrary\",\"requestDateTime\":\"2023-12-05T22:06:47.202Z\",\"requestStatus\":\"PENDING\",\"operationName\":\"scmInvoicePaymentCreate\"},\"validationResults\":{\"errorMessages\":null,\"messageProperties\":null}}}',	'2023-12-05 22:04:46');

DROP TABLE IF EXISTS `tokens`;
CREATE TABLE `tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `token` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `datetime` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `lastname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `kerberos` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `library` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `users` (`id`, `firstname`, `lastname`, `email`, `kerberos`, `library`) VALUES
(1,	'Lynette',	'Young',	'lynyoung@ucdavis.edu',	'lynyoung',	'SHLDS'),
(2,	'Mark',	'Warren',	'mjwarren@ucdavis.edu',	'mjwarren',	'SHLDS'),
(4,	'Pao',	'Yang',	'paoyang@ucdavis.edu',	'paoyang',	'LAW'),
(5,	'Lisa',	'Spagnolo',	'lcspagnolo@ucdavis.edu',	'lcspag',	'SHLDS'),
(6,	'Elizabeth',	'Vaziri',	'evaziri@ucdavis.edu',	'evaziri',	'SHLDS');

DROP TABLE IF EXISTS `vendors`;
CREATE TABLE `vendors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `vendorId` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `vendorData` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `vendors` (`id`, `vendorId`, `vendorData`) VALUES
(1,	'GOBI',	'{\"code\":\"GOBI\",\"name\":\"GOBI LIBRARY SOLUTIONS\",\"status\":{\"value\":\"ACTIVE\",\"desc\":\"Active\"},\"language\":{\"value\":\"en\",\"desc\":\"English\"},\"licensor\":true,\"governmental\":false,\"additional_code\":\"DF PAY-5\",\"financial_sys_code\":\"8563\",\"liable_for_vat\":true,\"material_supplier\":true,\"access_provider\":false,\"library\":[{\"code\":{\"value\":\"SHLDS\",\"desc\":\"Shields Library\"},\"include_sub_units\":false}],\"currency\":[{\"value\":\"USD\",\"desc\":\"US Dollar\"}],\"account\":[{\"code\":\"704810\",\"description\":\"Account (M)\",\"status\":{\"value\":\"INACTIVE\",\"desc\":\"Inactive\"},\"account_id\":\"756922990003126\",\"library\":[{\"code\":{\"value\":\"SHLDS\",\"desc\":\"Shields Library\"},\"include_sub_units\":true}],\"discount_percent\":\"0.0\",\"payment_method\":[{\"value\":\"ACCOUNTINGDEPARTMENT\",\"desc\":\"Accounting Department\"}],\"expected_receipt_interval\":\"180\",\"subscription_interval\":\"90\",\"contact_info\":{\"address\":[],\"email\":[],\"phone\":[]},\"contact_person\":[]},{\"code\":\"GOBI\",\"description\":\"Default Account\",\"status\":{\"value\":\"ACTIVE\",\"desc\":\"Active\"},\"account_id\":\"756923020003126\",\"library\":[{\"code\":{\"value\":\"SHLDS\",\"desc\":\"Shields Library\"},\"include_sub_units\":true}],\"discount_percent\":\"0.0\",\"payment_method\":[{\"value\":\"ACCOUNTINGDEPARTMENT\",\"desc\":\"Accounting Department\"}],\"expected_receipt_interval\":\"180\",\"subscription_interval\":\"90\",\"reclaim_interval\":\"0\",\"contact_info\":{\"address\":[],\"email\":[],\"phone\":[]},\"contact_person\":[]},{\"code\":\"GOBI5\",\"description\":\"GOBI US Approval Account\",\"status\":{\"value\":\"ACTIVE\",\"desc\":\"Active\"},\"account_id\":\"3356356530003126\",\"library\":[{\"code\":{\"value\":\"SHLDS\",\"desc\":\"Shields Library\"},\"include_sub_units\":true}],\"payment_method\":[{\"value\":\"ACCOUNTINGDEPARTMENT\",\"desc\":\"Accounting Department\"}],\"expected_receipt_interval\":\"180\",\"subscription_interval\":\"90\",\"reclaim_interval\":\"0\",\"contact_info\":{\"address\":[],\"email\":[],\"phone\":[]},\"contact_person\":[]},{\"code\":\"GOBIEA\",\"description\":\"GOBI Ebook Approval\",\"status\":{\"value\":\"ACTIVE\",\"desc\":\"Active\"},\"account_id\":\"19934586180003126\",\"library\":[{\"code\":{\"value\":\"SHLDS\",\"desc\":\"Shields Library\"},\"include_sub_units\":true}],\"payment_method\":[{\"value\":\"ACCOUNTINGDEPARTMENT\",\"desc\":\"Accounting Department\"}],\"expected_receipt_interval\":\"20\",\"subscription_interval\":\"90\",\"reclaim_interval\":\"0\",\"contact_info\":{\"address\":[],\"email\":[],\"phone\":[]},\"contact_person\":[]},{\"code\":\"GOBIEB\",\"description\":\"GOBI Ebook Firm\",\"status\":{\"value\":\"ACTIVE\",\"desc\":\"Active\"},\"note\":\"For API mapping (if using that for ebooks). Past use: Test of GOBI ebook subaccount for EDI invoice loading (invoice parameters by subaccount).\",\"account_id\":\"10651901200003126\",\"library\":[{\"code\":{\"value\":\"SHLDS\",\"desc\":\"Shields Library\"},\"include_sub_units\":true}],\"payment_method\":[{\"value\":\"ACCOUNTINGDEPARTMENT\",\"desc\":\"Accounting Department\"}],\"expected_receipt_interval\":\"20\",\"subscription_interval\":\"90\",\"reclaim_interval\":\"0\",\"contact_info\":{\"address\":[],\"email\":[],\"phone\":[]},\"contact_person\":[]},{\"code\":\"GOBIF\",\"description\":\"GOBI Print Firm\",\"status\":{\"value\":\"ACTIVE\",\"desc\":\"Active\"},\"account_id\":\"19934585030003126\",\"library\":[{\"code\":{\"value\":\"SHLDS\",\"desc\":\"Shields Library\"},\"include_sub_units\":true}],\"discount_percent\":\"0.0\",\"payment_method\":[{\"value\":\"ACCOUNTINGDEPARTMENT\",\"desc\":\"Accounting Department\"}],\"expected_receipt_interval\":\"180\",\"subscription_interval\":\"90\",\"reclaim_interval\":\"0\",\"contact_info\":{\"address\":[],\"email\":[],\"phone\":[]},\"contact_person\":[]},{\"code\":\"GOBIUK\",\"description\":\"GOBI UK Account\",\"status\":{\"value\":\"ACTIVE\",\"desc\":\"Active\"},\"account_id\":\"3356356620003126\",\"library\":[{\"code\":{\"value\":\"SHLDS\",\"desc\":\"Shields Library\"},\"include_sub_units\":true}],\"payment_method\":[{\"value\":\"ACCOUNTINGDEPARTMENT\",\"desc\":\"Accounting Department\"}],\"expected_receipt_interval\":\"180\",\"subscription_interval\":\"90\",\"reclaim_interval\":\"0\",\"contact_info\":{\"address\":[],\"email\":[],\"phone\":[]},\"contact_person\":[]},{\"code\":\"GOBIUK5\",\"description\":\"GOBI UK Approval Account\",\"status\":{\"value\":\"ACTIVE\",\"desc\":\"Active\"},\"account_id\":\"3356357490003126\",\"library\":[{\"code\":{\"value\":\"SHLDS\",\"desc\":\"Shields Library\"},\"include_sub_units\":true}],\"payment_method\":[{\"value\":\"ACCOUNTINGDEPARTMENT\",\"desc\":\"Accounting Department\"}],\"expected_receipt_interval\":\"180\",\"subscription_interval\":\"90\",\"reclaim_interval\":\"0\",\"contact_info\":{\"address\":[],\"email\":[],\"phone\":[]},\"contact_person\":[]}],\"contact_person\":[],\"interface\":[],\"contact_info\":{\"address\":[{\"line1\":\"999 MAPLE ST\",\"line2\":\"CONTOOCOOK, NH 03229-9989\",\"country\":{\"value\":\"\",\"desc\":\"\"},\"start_date\":\"2016-03-11Z\",\"address_type\":[{\"value\":\"order\",\"desc\":\"Order\"}],\"preferred\":true},{\"line1\":\"PO BOX 277991\",\"line2\":\"ATLANTA, GA  30384-7991\",\"country\":{\"value\":\"\",\"desc\":\"\"},\"start_date\":\"2016-03-11Z\",\"address_type\":[{\"value\":\"payment\",\"desc\":\"Payment\"}],\"preferred\":false}],\"email\":[],\"phone\":[{\"phone_number\":\"(800) 258-3774\",\"phone_type\":[{\"value\":\"orderPhone\",\"desc\":\"Order phone\"}],\"preferred\":true,\"preferred_sms\":true},{\"phone_number\":\"(603) 746 5628\",\"phone_type\":[{\"value\":\"orderFax\",\"desc\":\"Order fax\"}],\"preferred\":false,\"preferred_sms\":false}],\"web_address\":[{\"url\":\"www.ybp.com\",\"url_type\":{\"value\":\"PrimaryProduct\",\"desc\":\"Primary Product\"}}]},\"edi_info\":{\"code\":\"1694510\",\"type\":{\"value\":\"31B\",\"desc\":\"31B - US-SAN\"},\"invoices\":true,\"password\":\"5&ze9u\",\"naming_convention\":{\"value\":\"0\",\"desc\":\"Standard\"},\"vendor_format\":{\"value\":\"YBP\",\"desc\":\"Yankee Book Peddler\"},\"po_lines\":false,\"additional_order_number\":true,\"include_fund_code\":true,\"do_not_prorate\":true,\"fund_code\":{\"value\":\"GENLPOSTXXXXOTF\",\"desc\":\"GENERAL POSTAGE OTHER FIRM\"},\"ftp_description\":\"FTP Information for EDI of current Vendor\",\"server_name\":\"ftp.ybp.com\",\"port_number\":21,\"user_name\":\"davis\",\"input_path\":\"invoice\",\"output_path\":\"orders\",\"allow_navigation\":true,\"secured_ftp\":false,\"send_command\":{\"value\":\"A\",\"desc\":\"Append\"},\"passive_mode\":false,\"ftp_mode\":{\"value\":\"B\",\"desc\":\"Binary\"},\"per_organization_unit\":[{\"organization_unit\":{\"value\":\"SHLDS\",\"desc\":\"Shields Library\"},\"edi_code\":\"3318788\",\"edi_type\":{\"value\":\"31B\",\"desc\":\"31B - US-SAN\"}}],\"ean_account\":[]},\"note\":[{\"content\":\"$18.25 paid\",\"creation_date\":\"2016-10-04Z\",\"created_by\":\"ILFRANKS\"},{\"content\":\"LE/LI send methods changed to PRINT per rep-change 455 (v.18), do not change. T.Maw 2/08 --- EDI Account  corrected vendor #\",\"creation_date\":\"2016-03-11Z\",\"created_by\":\"EX_LIBRIS\"}]}');

-- 2023-12-07 19:19:18
