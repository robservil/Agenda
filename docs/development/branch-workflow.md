# Branch Workflow

Describe el flujo de trabajo para desarrollar funcionalidades.

## Crear una feature

1. Crear rama desde develop

git checkout develop  
git checkout -b feature/feature-name

2. Desarrollar la funcionalidad

3. Hacer commits siguiendo la commit policy

4. Subir la rama

git push origin feature/feature-name

5. Crear Pull Request hacia develop

## Integración

La feature se mergea en develop después de:

- pasar tests
- pasar revisión de código
