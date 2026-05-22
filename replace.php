<?php

$dirs = ['app', 'resources', 'tests', 'routes', 'database', 'config'];
$extensions = ['php', 'tsx', 'ts', 'js', 'json', 'blade.php'];

function processDir($dir)
{
    global $extensions;
    $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir));
    foreach ($iterator as $file) {
        if ($file->isFile()) {
            $ext = pathinfo($file->getPathname(), PATHINFO_EXTENSION);
            if (in_array($ext, $extensions) || str_ends_with($file->getPathname(), '.blade.php')) {
                $content = file_get_contents($file->getPathname());
                if (strpos($content, 'hancms.') !== false) {
                    $newContent = str_replace('hancms.', 'cms.', $content);
                    file_put_contents($file->getPathname(), $newContent);
                }
            }
        }
    }
}

foreach ($dirs as $dir) {
    if (is_dir($dir)) {
        processDir($dir);
    }
}

// Rename lang files
$langDirs = glob('lang/*', GLOB_ONLYDIR);
foreach ($langDirs as $langDir) {
    if (file_exists("$langDir/hancms.php")) {
        rename("$langDir/hancms.php", "$langDir/cms.php");
    }
}

echo "Done replacing hancms. with cms.\n";
