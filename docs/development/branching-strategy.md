# Branching Strategy

El proyecto sigue un modelo basado en **GitFlow simplificado**.

## Ramas principales

main  
Contiene el código listo para producción.

develop  
Contiene la integración de las nuevas funcionalidades. Se usará de base para la creación de otras ramas.

## Ramas auxiliares

feature/*
Se utilizan para desarrollar nuevas funcionalidades.

task/*
Para ramas utilizadas para otro tipo de tareas de código que no proporcionan nuevas funcionalidades, como refactorizar.

release/*
Estabilización de una versión antes de ir a producción.

hotfix/*
Correcciones urgentes extraídas directamente de main o alguna rama de release.

bugfix/*
Se utilizan para corregir errores.

docs/*
Elaboración o modificación de la documentación.


## Ejemplos

feature/user-authentication  
bugfix/plan-update-error  
hotfix/payment-crash
