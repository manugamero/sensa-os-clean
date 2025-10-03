#!/bin/bash

echo "🧹 Limpiando TODOS los secretos de forma agresiva..."

# Lista de patrones a reemplazar
PATTERNS=(
    "PLACEHOLDER-1npopg5l6me0liola2um4odmm4oi9oia\.apps\.googleusercontent\.com"
    "PLACEHOLDER"
    "PLACEHOLDER"
)

# Reemplazar en todos los archivos
for pattern in "${PATTERNS[@]}"; do
    echo "Limpiando patrón: $pattern"
    find . -type f \( -name "*.sh" -o -name "*.js" -o -name "*.md" \) -exec sed -i '' "s/$pattern/PLACEHOLDER/g" {} \;
done

echo "✅ Todos los secretos han sido reemplazados con PLACEHOLDER"
