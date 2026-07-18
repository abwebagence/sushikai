<?php
session_start();

// ============================================================
//  MOT DE PASSE : modifiez la valeur ci-dessous pour le changer
// ============================================================
const ADMIN_PASSWORD = 'SushiKai2026!';

// ---------- PDF : chaque carte met à jour la version PC ET mobile ----------
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

// ---------- Galerie : catégories de la page portfolio_classic_3_cols.html ----------
$galCategories = [
    'restaurant' => 'Le Restaurant',
    'food'       => 'Les plats',
    'drinks'     => 'Photos Clients',
    'events'     => 'Événements',
];
$galDirs = [__DIR__ . '/galerie', __DIR__ . '/mobile/galerie'];

$message = '';
$erreur  = '';

// ---------- Fonctions galerie ----------

function galLireJson(array $dirs) {
    $chemin = $dirs[0] . '/galerie.json';
    if (!is_file($chemin)) return [];
    $data = json_decode((string)file_get_contents($chemin), true);
    return is_array($data) ? $data : [];
}

function galEcrireJson(array $dirs, array $photos) {
    $flags = JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES;
    if (defined('JSON_INVALID_UTF8_SUBSTITUTE')) $flags |= JSON_INVALID_UTF8_SUBSTITUTE;
    $json = json_encode(array_values($photos), $flags);
    if ($json === false) return false; // ne jamais écraser la liste avec un contenu vide
    $ok = true;
    foreach ($dirs as $dir) {
        if (!is_dir($dir) && !mkdir($dir, 0755, true)) { $ok = false; continue; }
        if (file_put_contents($dir . '/galerie.json', $json) === false) $ok = false;
    }
    return $ok;
}

// Garantit une chaîne UTF-8 valide (titres collés depuis Word, vieux navigateurs…)
function galUtf8($texte) {
    if (preg_match('//u', $texte)) return $texte;
    $converti = @iconv('Windows-1252', 'UTF-8', $texte);
    if ($converti !== false && preg_match('//u', $converti)) return $converti;
    return preg_replace('/[\x80-\xFF]/', '', $texte);
}

function galChargerImage($tmp, $type) {
    switch ($type) {
        case IMAGETYPE_JPEG: $img = @imagecreatefromjpeg($tmp); break;
        case IMAGETYPE_PNG:  $img = @imagecreatefrompng($tmp); break;
        case IMAGETYPE_WEBP: $img = function_exists('imagecreatefromwebp') ? @imagecreatefromwebp($tmp) : false; break;
        default: return false;
    }
    if (!$img) return false;
    // Rotation automatique selon l'orientation EXIF (photos de téléphone)
    if ($type === IMAGETYPE_JPEG && function_exists('exif_read_data')) {
        $exif = @exif_read_data($tmp);
        $o = isset($exif['Orientation']) ? (int)$exif['Orientation'] : 1;
        if ($o === 3)      $img = imagerotate($img, 180, 0);
        elseif ($o === 6)  $img = imagerotate($img, -90, 0);
        elseif ($o === 8)  $img = imagerotate($img, 90, 0);
    }
    return $img;
}

// Réduit l'image au format max 1600px, sur fond blanc (grand format "Agrandir")
function galGrandFormat($src, $maxCote = 1600) {
    $w = imagesx($src); $h = imagesy($src);
    $ratio = min(1, $maxCote / max($w, $h));
    $nw = max(1, (int)round($w * $ratio));
    $nh = max(1, (int)round($h * $ratio));
    $dst = imagecreatetruecolor($nw, $nh);
    imagefill($dst, 0, 0, imagecolorallocate($dst, 255, 255, 255));
    imagecopyresampled($dst, $src, 0, 0, 0, 0, $nw, $nh, $w, $h);
    return $dst;
}

// Vignette 448x344 recadrée au centre : même format que la grille de la galerie
function galVignette($src, $tw = 448, $th = 344) {
    $w = imagesx($src); $h = imagesy($src);
    $scale = max($tw / $w, $th / $h);
    $cw = max(1, (int)round($tw / $scale));
    $ch = max(1, (int)round($th / $scale));
    $sx = (int)(($w - $cw) / 2);
    $sy = (int)(($h - $ch) / 2);
    $dst = imagecreatetruecolor($tw, $th);
    imagefill($dst, 0, 0, imagecolorallocate($dst, 255, 255, 255));
    imagecopyresampled($dst, $src, 0, 0, $sx, $sy, $tw, $th, $cw, $ch);
    return $dst;
}

// ---------- Déconnexion ----------
if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: admin-pdf.php');
    exit;
}

// ---------- Connexion ----------
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

// Envoi trop volumineux : PHP vide $_POST et $_FILES silencieusement
if ($connecte && $_SERVER['REQUEST_METHOD'] === 'POST' && empty($_POST) && empty($_FILES)) {
    $erreur = 'Fichier trop volumineux pour le serveur : réduisez sa taille et réessayez.';
}

$jetonValide = $connecte && isset($_POST['jeton']) && hash_equals($_SESSION['jeton'], $_POST['jeton']);

// ---------- Remplacement d'un PDF ----------
if ($connecte && isset($_POST['doc'], $_FILES['pdf'])) {
    $doc = $_POST['doc'];
    if (!$jetonValide) {
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
                if (!copy($tmp, $destination)) $ok = false;
            }
            if ($ok) {
                $message = $documents[$doc]['label'] . ' remplacé avec succès (versions PC et mobile).';
            } else {
                $erreur = 'Impossible d\'écrire le fichier sur le serveur (vérifiez les droits d\'écriture).';
            }
        }
    }
}

// ---------- Ajout d'une photo dans la galerie ----------
if ($connecte && isset($_POST['gal_cat'], $_FILES['photo'])) {
    $cat   = $_POST['gal_cat'];
    $titre = galUtf8(trim((string)($_POST['gal_titre'] ?? '')));
    if (function_exists('mb_substr')) { $titre = mb_substr($titre, 0, 60, 'UTF-8'); } else { $titre = substr($titre, 0, 60); }

    if (!$jetonValide) {
        $erreur = 'Session expirée, réessayez.';
    } elseif (!isset($galCategories[$cat])) {
        $erreur = 'Catégorie inconnue.';
    } elseif ($_FILES['photo']['error'] !== UPLOAD_ERR_OK) {
        $erreur = 'Erreur lors de l\'envoi de la photo (photo trop lourde ou envoi interrompu).';
    } elseif (!is_uploaded_file($_FILES['photo']['tmp_name'])) {
        $erreur = 'Fichier invalide.';
    } else {
        $tmp  = $_FILES['photo']['tmp_name'];
        $info = @getimagesize($tmp);
        $typesOk = [IMAGETYPE_JPEG, IMAGETYPE_PNG, IMAGETYPE_WEBP];
        if (!$info || !in_array($info[2], $typesOk, true)) {
            $erreur = 'Format non reconnu : utilisez une photo JPG, PNG ou WebP (les photos iPhone en HEIC doivent être converties en JPG).';
        } else {
            @ini_set('memory_limit', '512M');
            $id = 'photo-' . date('Ymd-His') . '-' . bin2hex(random_bytes(3));
            $ok = false;
            $fichierFull = $fichierThumb = '';

            if (function_exists('imagecreatetruecolor')) {
                $src = galChargerImage($tmp, $info[2]);
                if ($src) {
                    $full  = galGrandFormat($src);
                    $thumb = galVignette($src);
                    $fichierFull  = $id . '.jpg';
                    $fichierThumb = $id . '-min.jpg';
                    $ok = true;
                    foreach ($galDirs as $dir) {
                        if (!is_dir($dir) && !mkdir($dir, 0755, true)) { $ok = false; break; }
                        if (!imagejpeg($full, $dir . '/' . $fichierFull, 84)) $ok = false;
                        if (!imagejpeg($thumb, $dir . '/' . $fichierThumb, 82)) $ok = false;
                    }
                    imagedestroy($full);
                    imagedestroy($thumb);
                    imagedestroy($src);
                }
            }

            // Secours si GD est indisponible : on garde la photo telle quelle
            if (!$ok && $fichierFull === '') {
                $ext = image_type_to_extension($info[2], false);
                $fichierFull = $fichierThumb = $id . '.' . $ext;
                $ok = true;
                foreach ($galDirs as $dir) {
                    if (!is_dir($dir) && !mkdir($dir, 0755, true)) { $ok = false; break; }
                    if (!copy($tmp, $dir . '/' . $fichierFull)) $ok = false;
                }
            }

            if ($ok) {
                $photos = galLireJson($galDirs);
                $photos[] = [
                    'file'  => $fichierFull,
                    'thumb' => $fichierThumb,
                    'cat'   => $cat,
                    'title' => $titre,
                    'date'  => date('Y-m-d H:i'),
                ];
                if (galEcrireJson($galDirs, $photos)) {
                    $message = 'Photo ajoutée dans « ' . $galCategories[$cat] . ' » (versions PC et mobile).';
                } else {
                    $erreur = 'Photo enregistrée mais impossible de mettre à jour la liste (droits d\'écriture ?).';
                }
            } else {
                $erreur = 'Impossible d\'enregistrer la photo sur le serveur (droits d\'écriture ?).';
            }
        }
    }
}

// ---------- Suppression d'une photo de la galerie ----------
if ($connecte && isset($_POST['gal_suppr'])) {
    if (!$jetonValide) {
        $erreur = 'Session expirée, réessayez.';
    } else {
        $cible  = basename((string)$_POST['gal_suppr']);
        $photos = galLireJson($galDirs);
        $restantes = [];
        $trouvee = null;
        foreach ($photos as $p) {
            if (isset($p['file']) && $p['file'] === $cible) { $trouvee = $p; } else { $restantes[] = $p; }
        }
        if (!$trouvee) {
            $erreur = 'Photo introuvable.';
        } else {
            foreach ($galDirs as $dir) {
                @unlink($dir . '/' . basename($trouvee['file']));
                if (!empty($trouvee['thumb']) && $trouvee['thumb'] !== $trouvee['file']) {
                    @unlink($dir . '/' . basename($trouvee['thumb']));
                }
            }
            galEcrireJson($galDirs, $restantes);
            $message = 'Photo supprimée de la galerie (versions PC et mobile).';
        }
    }
}

$galPhotos = $connecte ? galLireJson($galDirs) : [];
?>
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Sushi Kai — Administration</title>
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
    .sous-titre { color: #999; margin-bottom: 30px; font-size: 15px; text-align: center; }
    .section-titre {
        max-width: 720px; width: 100%;
        font-size: 15px; text-transform: uppercase; letter-spacing: 2px;
        color: #e63946; margin: 26px 0 14px; padding-bottom: 8px;
        border-bottom: 1px solid #3a3a3a;
    }
    .alerte {
        max-width: 720px; width: 100%;
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
        max-width: 720px; width: 100%;
        margin-bottom: 24px;
    }
    .carte h2 { font-size: 19px; margin-bottom: 4px; }
    .maj { color: #999; font-size: 13px; margin-bottom: 16px; }
    .maj a, .lien { color: #64b5f6; }
    label { display: block; font-size: 13px; color: #aaa; margin-bottom: 6px; }
    input[type=file] {
        width: 100%; padding: 12px;
        background: #1a1a1a; border: 1px dashed #555; border-radius: 8px;
        color: #ccc; margin-bottom: 14px; cursor: pointer; font-size: 14px;
    }
    input[type=password], input[type=text], select {
        width: 100%; padding: 12px 14px;
        background: #1a1a1a; border: 1px solid #555; border-radius: 8px;
        color: #eee; font-size: 15px; margin-bottom: 14px;
    }
    select { cursor: pointer; }
    button {
        width: 100%; padding: 13px;
        background: #e63946; color: #fff;
        border: none; border-radius: 8px;
        font-size: 16px; font-weight: 600; cursor: pointer;
    }
    button:hover { background: #d32f3d; }
    .deux-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    @media (max-width: 560px) { .deux-cols { grid-template-columns: 1fr; } }
    .photos-grille {
        display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 14px; margin-top: 6px;
    }
    .photo-boite {
        background: #1a1a1a; border: 1px solid #3a3a3a; border-radius: 8px;
        overflow: hidden; display: flex; flex-direction: column;
    }
    .photo-boite img { width: 100%; height: 110px; object-fit: cover; display: block; }
    .photo-infos { padding: 8px 10px; font-size: 12px; color: #bbb; line-height: 1.45; flex: 1; }
    .photo-infos b { color: #eee; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .photo-cat { color: #e6a039; }
    .photo-boite button {
        border-radius: 0; padding: 8px; font-size: 13px;
        background: #3a3a3a;
    }
    .photo-boite button:hover { background: #c62828; }
    .vide { color: #777; font-size: 14px; }
    .deconnexion { margin-top: 10px; }
    .deconnexion a { color: #777; font-size: 14px; text-decoration: none; }
    .deconnexion a:hover { color: #bbb; }
    .note { color: #777; font-size: 13px; max-width: 720px; text-align: center; line-height: 1.5; }
</style>
</head>
<body>

<h1>Sushi <span>Kai</span> — Administration</h1>

<?php if (!$connecte): ?>

    <p class="sous-titre">Espace réservé — connectez-vous</p>
    <?php if ($erreur): ?><div class="alerte ko"><?= htmlspecialchars($erreur) ?></div><?php endif; ?>
    <div class="carte" style="max-width:560px">
        <form method="post">
            <input type="password" name="password" placeholder="Mot de passe" autofocus required>
            <button type="submit">Se connecter</button>
        </form>
    </div>

<?php else: ?>

    <p class="sous-titre">Chaque action met à jour le site PC et le site mobile en même temps.</p>

    <?php if ($message): ?><div class="alerte ok">✔ <?= htmlspecialchars($message) ?></div><?php endif; ?>
    <?php if ($erreur):  ?><div class="alerte ko">✘ <?= htmlspecialchars($erreur)  ?></div><?php endif; ?>

    <h2 class="section-titre">📄 Menus PDF</h2>

    <?php foreach ($documents as $cle => $docu):
        $chemin = $docu['fichiers'][0];
        $date = is_file($chemin) ? date('d/m/Y à H\hi', filemtime($chemin)) : 'inconnu';
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

    <h2 class="section-titre">📷 Galerie photos</h2>

    <div class="carte">
        <h2>Ajouter une photo</h2>
        <p class="maj">Elle apparaîtra sur la <a href="portfolio_classic_3_cols.html" target="_blank">page Galerie</a>
            dans la catégorie choisie. La photo est automatiquement recadrée et optimisée.</p>
        <form method="post" enctype="multipart/form-data">
            <input type="hidden" name="jeton" value="<?= htmlspecialchars($_SESSION['jeton']) ?>">
            <div class="deux-cols">
                <div>
                    <label>Catégorie</label>
                    <select name="gal_cat" required>
                        <?php foreach ($galCategories as $cle => $label): ?>
                        <option value="<?= $cle ?>"><?= htmlspecialchars($label) ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div>
                    <label>Titre affiché sous la photo (facultatif)</label>
                    <input type="text" name="gal_titre" maxlength="60" placeholder="Ex : Plateau du chef">
                </div>
            </div>
            <label>Photo (JPG, PNG ou WebP)</label>
            <input type="file" name="photo" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" required>
            <button type="submit">Ajouter à la galerie</button>
        </form>
    </div>

    <div class="carte">
        <h2>Photos ajoutées (<?= count($galPhotos) ?>)</h2>
        <p class="maj">Seules les photos ajoutées ici peuvent être supprimées ici — les photos d'origine du site ne bougent pas.</p>
        <?php if (!$galPhotos): ?>
            <p class="vide">Aucune photo ajoutée pour le moment.</p>
        <?php else: ?>
        <div class="photos-grille">
            <?php foreach (array_reverse($galPhotos) as $p): ?>
            <div class="photo-boite">
                <a href="galerie/<?= htmlspecialchars($p['file']) ?>" target="_blank">
                    <img src="galerie/<?= htmlspecialchars($p['thumb']) ?>" alt="" loading="lazy">
                </a>
                <div class="photo-infos">
                    <b><?= htmlspecialchars($p['title'] !== '' ? $p['title'] : 'Sans titre') ?></b>
                    <span class="photo-cat"><?= htmlspecialchars(isset($galCategories[$p['cat']]) ? $galCategories[$p['cat']] : $p['cat']) ?></span><br>
                    <?= htmlspecialchars(isset($p['date']) ? $p['date'] : '') ?>
                </div>
                <form method="post" onsubmit="return confirm('Supprimer définitivement cette photo de la galerie ?');">
                    <input type="hidden" name="jeton" value="<?= htmlspecialchars($_SESSION['jeton']) ?>">
                    <input type="hidden" name="gal_suppr" value="<?= htmlspecialchars($p['file']) ?>">
                    <button type="submit">Supprimer</button>
                </form>
            </div>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>
    </div>

    <p class="note">Les changements sont en ligne immédiatement. Si une page affiche encore l'ancienne version,
    actualisez-la avec Ctrl&nbsp;+&nbsp;F5.</p>
    <p class="deconnexion"><a href="?logout=1">Se déconnecter</a></p>

<?php endif; ?>

</body>
</html>
