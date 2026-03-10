# Run this from the dental-crm project root to restructure into a monorepo
# PowerShell script

Set-Location "c:\Users\gusta\.gemini\antigravity\scratch\dental-crm"

# Create frontend directory
New-Item -ItemType Directory -Force -Path frontend

# Move files into frontend/
git mv index.html frontend/index.html
git mv css frontend/css
git mv js frontend/js
git mv nginx.conf frontend/nginx.conf
git mv Dockerfile frontend/Dockerfile

git add .
git status
Write-Host "Ready to commit. Run: git commit -m 'refactor: monorepo structure (frontend/ + backend/)'"
