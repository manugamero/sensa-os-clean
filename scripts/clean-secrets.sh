#!/bin/bash

echo "🧹 Limpiando secretos de los archivos..."

# Lista de archivos que contienen secretos
FILES_WITH_SECRETS=(
    "scripts/auto-fix-auth.sh"
    "scripts/enable-google-auth.js"
    "scripts/quick-deploy.sh"
    "scripts/setup-production.sh"
    "scripts/deep-debug.sh"
    "scripts/update-client-id.sh"
    "scripts/enable-apis.sh"
    "scripts/configure-production-google.sh"
    "scripts/enable-working-apis.sh"
    "scripts/enable-production-apis.sh"
    "scripts/fix-project-id.sh"
    "scripts/fix-identity-api.sh"
)

# Reemplazar secretos con placeholders
for file in "${FILES_WITH_SECRETS[@]}"; do
    if [ -f "$file" ]; then
        echo "Limpiando $file..."
        
        # Reemplazar Client ID real con placeholder
        sed -i '' 's/your-project-id-1npopg5l6me0liola2um4odmm4oi9oia\.apps\.googleusercontent\.com/your-google-client-id/g' "$file"
        
        # Reemplazar Client Secret real con placeholder
        sed -i '' 's/your-google-client-secret/your-google-client-secret/g' "$file"
        
        # Reemplazar Project ID real con placeholder
        sed -i '' 's/your-project-id/your-project-id/g' "$file"
        
        echo "✅ $file limpiado"
    fi
done

echo "🎉 Todos los secretos han sido reemplazados con placeholders"
