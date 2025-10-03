#!/bin/bash

echo "🚀 Git Workflow para Sensa OS"
echo ""

# Función para hacer commit y push
commit_and_push() {
    local message="$1"
    
    echo "📝 Agregando cambios..."
    git add .
    
    echo "💾 Haciendo commit: $message"
    git commit -m "$message"
    
    echo "🚀 Haciendo push a GitHub..."
    git push origin main
    
    echo "✅ Cambios sincronizados con GitHub"
}

# Función para crear un nuevo commit con mensaje personalizado
new_commit() {
    echo "💬 Ingresa el mensaje del commit:"
    read -r message
    
    if [ -z "$message" ]; then
        echo "❌ Mensaje vacío, cancelando..."
        return 1
    fi
    
    commit_and_push "$message"
}

# Función para commit rápido con mensaje predefinido
quick_commit() {
    local type="$1"
    local message="$2"
    
    case $type in
        "fix")
            commit_and_push "🐛 Fix: $message"
            ;;
        "feat")
            commit_and_push "✨ Feature: $message"
            ;;
        "update")
            commit_and_push "🔄 Update: $message"
            ;;
        "security")
            commit_and_push "🔒 Security: $message"
            ;;
        *)
            commit_and_push "$message"
            ;;
    esac
}

# Menú principal
echo "Selecciona una opción:"
echo "1) 📝 Nuevo commit personalizado"
echo "2) 🐛 Fix rápido"
echo "3) ✨ Feature rápido"
echo "4) 🔄 Update rápido"
echo "5) 🔒 Security rápido"
echo "6) 📊 Ver estado del repositorio"
echo "7) 🔍 Ver historial de commits"
echo ""

read -p "Opción (1-7): " option

case $option in
    1)
        new_commit
        ;;
    2)
        echo "💬 Describe el fix:"
        read -r fix_message
        quick_commit "fix" "$fix_message"
        ;;
    3)
        echo "💬 Describe la nueva feature:"
        read -r feat_message
        quick_commit "feat" "$feat_message"
        ;;
    4)
        echo "💬 Describe la actualización:"
        read -r update_message
        quick_commit "update" "$update_message"
        ;;
    5)
        echo "💬 Describe el cambio de seguridad:"
        read -r security_message
        quick_commit "security" "$security_message"
        ;;
    6)
        echo "📊 Estado del repositorio:"
        git status
        echo ""
        echo "📈 Últimos commits:"
        git log --oneline -5
        ;;
    7)
        echo "🔍 Historial de commits:"
        git log --oneline -10
        ;;
    *)
        echo "❌ Opción inválida"
        exit 1
        ;;
esac

echo ""
echo "🎉 ¡Trabajo completado!"
