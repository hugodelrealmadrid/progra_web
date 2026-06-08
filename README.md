# progra_web — Academia de Música Man Césped

## Layout base (Emily Condori)

- [x] Tailwind CSS con paleta AMC (`tailwind.config.js`)
- [x] Componente `Navbar` — links públicos + INGRESAR / menú por rol
- [x] Componente `Footer` — info institucional
- [x] `MainLayout` — envuelve todas las páginas públicas

## Cómo correr en tu PC

```powershell
cd C:\Users\EMILY\progra_web
npm install
npm run dev
```

Abre la URL que muestra Vite (ej. http://localhost:5173).

## Probar menú de usuario por rol

En `src/App.jsx`, descomenta:

```js
const MOCK_USER = { nombre: 'Emily Condori', rol: 'admin' };
```

Roles: `estudiante` | `profesor` | `admin`

## Colores Tailwind AMC

| Clase | Hex |
|-------|-----|
| `bg-amc-verde` | #1D6A34 |
| `bg-amc-oscuro` | #155027 |
| `bg-amc-acento` | #2A8A4A |
| `bg-amc-claro` | #D6EFD8 |
| `bg-amc-palido` | #EAF4EB |

## Subir a GitHub

```powershell
git init
git add .
git commit -m "feat(layout): Tailwind AMC, Navbar y Footer - Emily Condori"
git remote add origin https://github.com/hugodelrealmadrid/progra_web.git
git pull origin main --allow-unrelated-histories
git push -u origin main
```

(Coordina con Hugo si ya hay commits en el remoto.)
