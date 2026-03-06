# Commit Policy

Este documento define cómo deben escribirse los commits en el proyecto.

## Convención

Se utiliza **Conventional Commits**.

Formato:

type(scope): short description

Ejemplo:

feat(auth): add login endpoint
fix(api): resolve plan update bug
docs(readme): update installation guide

## Tipos de commit

feat → nueva funcionalidad  
fix → corrección de bug  
docs → cambios en documentación  
style → formato o estilo sin cambios funcionales  
refactor → cambio interno sin modificar comportamiento  
test → añadir o modificar tests  
chore → mantenimiento o configuración
feat!/fix! → indica un **BREAKING CHANGE** (cambio incompatible)

## Reglas

- Los commits deben ser **pequeños y atómicos**
- La descripción debe ser clara
- Usar **inglés**
- Máximo **72 caracteres** en el título
