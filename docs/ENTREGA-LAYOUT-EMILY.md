# Entrega Layout Base — Emily Betel Condori Pocori

## Checklist tarea

| Tarea | Estado | Evidencia |
|-------|--------|-----------|
| Tailwind CSS paleta AMC (#1D6A34, #2A8A4A) | ✅ | `tailwind.config.js` |
| Navbar: logo, links, INGRESAR / menú por rol | ✅ | `src/components/Navbar.jsx` |
| Footer institucional | ✅ | `src/components/Footer.jsx` |

## Cómo probar

```powershell
cd C:\Users\EMILY\progra_web
npm run dev
```

1. http://localhost:5173/ → visitante ve **INGRESAR**
2. http://localhost:5173/login → entrar como admin / profesor / estudiante
3. Menú usuario → **Mi panel** según rol
4. **Cerrar sesión** vuelve a visitante

## Archivos clave

- `tailwind.config.js` — colores amc-verde, amc-acento, etc.
- `src/components/Navbar.jsx`
- `src/components/Footer.jsx`
- `src/layouts/MainLayout.jsx`
- `src/context/AuthContext.jsx` — sesión demo (Firebase después)

## Relación con Figma

El código replica el Navbar/Footer del Figma (General + diseños del grupo).
Los paneles admin en Figma se programarán después; el layout ya los envuelve.
