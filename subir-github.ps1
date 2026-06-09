# Script para subir la parte de Emily al repositorio grupal
Set-Location $PSScriptRoot

Write-Host "=== Estado actual ===" -ForegroundColor Cyan
git status

Write-Host "`n=== Agregando archivos (sin .env) ===" -ForegroundColor Cyan
git add -A
if (Test-Path .env) {
    git restore --staged .env 2>$null
    Write-Host "  .env excluido (secretos)" -ForegroundColor Yellow
}

Write-Host "`n=== Creando commit ===" -ForegroundColor Cyan
git commit -m @"
feat(admin): panel admin, contenido Firestore y paginas publicas dinamicas

- Panel administrador con 7 secciones (cursos, usuarios, inscripciones, pagos, mensajes, contenido)
- Pagina General con hero animado, cursos destacados y CTA dinamico desde Firestore
- Pagina Historia con texto institucional editable por admin
- Integracion Firebase/Firestore con fallback a localStorage
- Paneles estudiante y profesor integrados en rutas

Emily Condori
"@

if ($LASTEXITCODE -ne 0) {
    Write-Host "No hay cambios nuevos o el commit fallo." -ForegroundColor Yellow
    exit 1
}

Write-Host "`n=== Sincronizando con GitHub ===" -ForegroundColor Cyan
git fetch origin master
git pull --rebase origin master

Write-Host "`n=== Subiendo a GitHub ===" -ForegroundColor Cyan
git push -u origin master

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nListo! Tu codigo esta en:" -ForegroundColor Green
    Write-Host "https://github.com/hugodelrealmadrid/progra_web" -ForegroundColor Green
    git log -1 --oneline
} else {
    Write-Host "`nError al subir. Si pide login, usa tu cuenta de GitHub." -ForegroundColor Red
}
