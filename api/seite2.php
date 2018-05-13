<html>
<head>
  <title>Econsider</title>
</head>
<body>
  <?php

  $verbindung = mysql_connect("###", "###", "###")
  or die ("Fehler im System");

  mysql_select_db("###")
  or die ("Verbindung zur Datenbank war nicht möglich!");

$URL = $_POST["URL"];
$Title = $_POST["Title"];
$Description = $_POST["Description"];
$SearchTags = $_POST["SearchTags"];
$Environment = $_POST["Environment"];
$Humanrights = $_POST["Humanrights"];
$Health = $_POST["Health"];
$Animalrights = $_POST["Animalrights"];
$Date = $_POST["Date"];



/* echo $URL;
echo $Titel; */

/* if($URL == "" or $Title == "" or $Description == "" or $ProductTags == "" or $ContentTags == "") {
echo "Es sind nicht alle Felder richtig ausgefüllt.";
} else { */

/* if ($chk == "Environment")
{ echo "Benutzer hat Environment angeklickt"; }
else
{ echo "Benutzer hat Environment angeklickt"; } */

$eintrag = "INSERT INTO Artikelsammlung
(URL, Title, Description, SearchTags, Environment, Humanrights, Health, Animalrights, Date)


VALUES
('$URL', '$Title', '$Description', '$SearchTags', '$Environment', '$Humanrights', '$Health', '$Animalrights', '$Date')";

$eintragen = mysql_query($eintrag);


//}

  mysql_close($verbindung);
  ?>

</body>
</html>
