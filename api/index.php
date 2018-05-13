<?php


// Initialize variable for database credentials
$dbhost = '###';
$dbuser = '###';
$dbpass = '###';
$dbname = '###';

//Create database connection
  $dblink = new mysqli($dbhost, $dbuser, $dbpass, $dbname);

//Check connection was successful
  if ($dblink->connect_errno) {
     printf("Failed to connect to database");
     exit();
  }

//Fetch 3 rows from actor table
  $result = $dblink->query("SELECT * FROM Artikelsammlung LIMIT 100");

//Initialize array variable
  $dbdata = array();

//Fetch into associative array
  while ( $row = $result->fetch_assoc())  {
	$dbdata[]=$row;
  }

header('Content-Type: application/json');
//Print array in JSON format
 echo json_encode($dbdata);

?>
