<?php
// we include the connexion file for database connection
require_once 'connexion.php';

try {
    // The $pdo variable comes from connexion.php
    $stmt = $pdo->query("SELECT reference, nom, prix, annee, possede FROM lego");
    $resultats = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // we tell to the client that we are sending JSON data
    header('Content-Type: application/json');
    
    // we encode the PHP array into a JSON string
    echo json_encode($resultats);

} catch (PDOException $e) {
    // if the query fails, we send an error 500 and a JSON error message
    header('Content-Type: application/json', true, 500);
    echo json_encode(['erreur' => $e->getMessage()]);
}
?>