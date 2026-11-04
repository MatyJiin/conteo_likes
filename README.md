# 🎤 Cómputo Oficial de Votos - Festival Escolar Voces de la Patagonia

Sistema de monitoreo y ranking de votos certificado para las 17 publicaciones del concurso de popularidad en Instagram (**Escuela Víctor Domingo Silva, Coyhaique** - 4.ª Edición).

## 🌟 Características
- **Podio y Ranking General:** Podio del 1° al 3° lugar y lista completa de los 17 concursantes.
- **Conexión Oficial Meta Graph API:** Lectura autorizada directamente desde los servidores de Meta.
- **Sincronización Periódica:** Los votos son validados y consolidados con los mecanismos de seguridad de Meta (con desfase técnico de replicación de 15 a 30 minutos).
- **Protección Edge Cache:** Arquitectura preparada para soportar miles de visitas concurrentes sin caídas ni bloqueos.

## 🚀 Despliegue en Vercel
Desplegado y sincronizado automáticamente en Vercel con servidor Edge.

## 💻 Ejecución Local
Para ejecutarlo con el servidor local:
1. Ejecuta `node server.js`
2. Abre en tu navegador `http://localhost:3000`
