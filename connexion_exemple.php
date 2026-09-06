<?php
// connexion setting
$host = '';
$port = '';
$dbname = '';
$user = '';
$password = '';
$dsn = "pgsql:host=$host;port=$port;dbname=$dbname";

try {
    $pdo = new PDO($dsn, $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // If the connection fails, we stop the script and return a JSON error message
    die(json_encode(['erreur' => 'Erreur de connexion à la base de données.']));
}
?>