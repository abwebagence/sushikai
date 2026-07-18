<?php
session_start();

// ============================================================
//  MOT DE PASSE : modifiez la valeur ci-dessous pour le changer
// ============================================================
const ADMIN_PASSWORD = 'SushiKai2026!';

// Chaque carte met à jour la version PC ET la version mobile en même temps
$documents = [
    'menu' => [
        'label'   => 'Menu du restaurant',
        'fichiers'=> [__DIR__ . '/pdf1.pdf', __DIR__ . '/mobile/pdf1.pdf'],
        'apercu'  => 'pdf1.pdf',
    ],
    'vins' => [
        'label'   => 'Carte des vins',
        'fichiers'=> [__DIR__ . '/pdf2.pdf', __DIR__ . '/mobile/pdf2.pdf'],
        'apercu'  => 'pdf2.pdf',
    ],
];

$message = '';
$erreur  = '';

// Déconnexion
if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: admin-pdf.php');
    exit;
}

// Connexion
if (isset($_POST['password'])) {
    if (hash_equals(ADMIN_PASSWORD, $_POST['password'])) {
        session_regenerate_id(true);
        $_SESSION['admin_ok'] = true;
        $_SESSION['jeton'] = bin2hex(random_bytes(16));
    } else {
        sleep(2); // freine les tentatives répétées
        $erreur = 'Mot de passe incorrect.';
    }
}

$connecte = !empty($_SESSION['admin_ok']);
if ($connecte && empty($_SESSION['jeton'])) {
    $_SESSION['jeton'] = bin2hex(random_bytes(16));
}

// Remplacement d'un PDF
if ($connecte && isset($_POST['doc'], $_FILES['pdf'])) {
    $doc = $_POST['doc'];
    if (!hash_equals($_SESSION['jeton'], $_POST['jeton'] ?? '')) {
        $erreur = 'Session expirée, réessayez.';
    } elseif (!isset($documents[$doc])) {
        $erreur = 'Document inconnu.';
    } elseif ($_FILES['pdf']['error'] !== UPLOAD_ERR_OK) {
        $erreur = 'Erreur lors de l\'envoi du fichier (fichier trop lourd ou envoi interrompu).';
    } else {
        $tmp = $_FILES['pdf']['tmp_name'];
        $entete = file_get_contents($tmp, false, null, 0, 5);
        if ($entete !== '%PDF-') {
            $erreur = 'Le fichier choisi n\'est pas un PDF valide.';
        } elseif (!is_uploaded_file($tmp)) {
            $erreur = 'Fichier invalide.';
        } else {
            $ok = true;
            foreach ($documents[$doc]['fichiers'] as $destination) {
                if (!copy($tmp, $destination)) {
                    $ok = false;
                }
            }
            if ($ok) {
                $message = $documents[$doc]['label'] . ' remplacé avec succès (versions PC et mobile).';
            } else {
                $erreur = 'Impossible d\'écrire le fichier sur le serveur (vérifiez les droits d\'écriture).';
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Sushi Kai — Gestion des PDF</title>
<style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
        font-family: 'Segoe UI', Arial, sans-serif;
        background: #1a1a1a;
        color: #eee;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 40px 16px;
    }
    h1 { font-size: 26px; margin-bottom: 6px; }
    h1 span { color: #e63946; }
    .sous-titre { color: #999; margin-bottom: 30px; font-size: 15px; }
    .alerte {
        max-width: 560px; width: 100%;
        padding: 14px 18px; border-radius: 8px; margin-bottom: 24px;
        font-size: 15px; line-height: 1.4;
    }
    .alerte.ok  { background: #1e4620; border: 1px solid #2e7d32; color: #a5d6a7; }
    .alerte.ko  { background: #4a1c1c; border: 1px solid #c62828; color: #ef9a9a; }
    .carte {
        background: #262626;
        border: 1px solid #3a3a3a;
        border-radius: 12px;
        padding: 26px;
        max-width: 560px; width: 100%;
        margin-bottom: 24px;
    }
    .carte h2 { font-size: 19px; margin-bottom: 4px; }
    .maj { color: #999; font-size: 13px; margin-bottom: 16px; }
    .maj a { color: #64b5f6; }
    input[type=file] {
        width: 100%; padding: 12px;
        background: #1a1a1a; border: 1px dashed #555; border-radius: 8px;
        color: #ccc; margin-bottom: 14px; cursor: pointer; font-size: 14px;
    }
    input[type=password] {
        width: 100%; padding: 12px 14px;
        background: #1a1a1a; border: 1px solid #555; border-radius: 8px;
        color: #eee; font-size: 16px; margin-bottom: 14px;
    }
    button {
        width: 100%; padding: 13px;
        background: #e63946; color: #fff;
        border: none; border-radius: 8px;
        font-size: 16px; font-weight: 600; cursor: pointer;
    }
    button:hover { background: #d32f3d; }
    .deconnexion { margin-top: 10px; }
    .deconnexion a { color: #777; font-size: 14px; text-decoration: none; }
    .deconnexion a:hover { color: #bbb; }
    .note { color: #777; font-size: 13px; max-width: 560px; text-align: center; line-height: 1.5; }
</style>
</head>
<body>

<h1>Sushi <span>Kai</span> — Gestion des PDF</h1>

<?php if (!$connecte): ?>

    <p class="sous-titre">Espace réservé — connectez-vous</p>
    <?php if ($erreur): ?><div class="alerte ko"><?= htmlspecialchars($erreur) ?></div><?php endif; ?>
    <div class="carte">
        <form method="post">
            <input type="password" name="password" placeholder="Mot de passe" autofocus required>
            <button type="submit">Se connecter</button>
        </form>
    </div>

<?php else: ?>

    <p class="sous-titre">Remplacez un PDF : les versions PC et mobile sont mises à jour en même temps.</p>

    <?php if ($message): ?><div class="alerte ok">✔ <?= htmlspecialchars($message) ?></div><?php endif; ?>
    <?php if ($erreur):  ?><div class="alerte ko">✘ <?= htmlspecialchars($erreur)  ?></div><?php endif; ?>

    <?php foreach ($documents as $cle => $docu):
        $chemin = $docu['fichiers'][0];
        $date = file_exists($chemin) ? date('d/m/Y à H\hi', filemtime($chemin)) : 'inconnu';
    ?>
    <div class="carte">
        <h2><?= htmlspecialchars($docu['label']) ?></h2>
        <p class="maj">
            Dernière mise à jour : <?= $date ?> —
            <a href="<?= htmlspecialchars($docu['apercu']) ?>?v=<?= time() ?>" target="_blank">voir le PDF actuel</a>
        </p>
        <form method="post" enctype="multipart/form-data">
            <input type="hidden" name="doc" value="<?= htmlspecialchars($cle) ?>">
            <input type="hidden" name="jeton" value="<?= htmlspecialchars($_SESSION['jeton']) ?>">
            <input type="file" name="pdf" accept="application/pdf,.pdf" required>
            <button type="submit">Remplacer ce PDF</button>
        </form>
    </div>
    <?php endforeach; ?>

    <p class="note">Le nouveau PDF est en ligne immédiatement. Si l'ancien s'affiche encore,
    actualisez la page du menu avec Ctrl&nbsp;+&nbsp;F5.</p>
    <p class="deconnexion"><a href="?logout=1">Se déconnecter</a></p>

<?php endif; ?>

</body>
</html>
