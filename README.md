# Glori-Fig

Frontend estático para la **gestión de firmas electrónicas** de una planta lechera (Leche Gloria). El objetivo es eliminar el recorrido de documentos de un área a otra mientras los camiones cisterna esperan autorización para descargar.

> Solo frontend: los datos son de ejemplo y viven en memoria. La firma dibujada se guarda en `localStorage` del navegador. El backend se conectará después.

## Tecnologías

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- Diseño inspirado en Material You: **azul y rojo Gloria sobre blanco**, tarjetas y bordes redondeados, chips de estado con color e icono (verde = listo, ámbar = pendiente, rojo = rechazado).

## Ejecutar

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`. Para generar la versión de producción:

```bash
npm run build
npm run preview
```

## Secciones

| Sección                       | Qué hace                                                                                                                                                                                                                                                                   |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Inicio**               | Panel con métricas del día, actividad reciente, avance por área y accesos rápidos.                                                                                                                                                                                      |
| **Registro de camiones** | Placa, conductor, punto de partida, litros, temperatura, hora de llegada, cisterna y área. Cada registro muestra el código de la **firma que lo autoriza**. Permite crear nuevos registros: al guardar se genera automáticamente una solicitud de firma vinculada. |
| **Centro de firmas**     | Lista separada de firmas de **camiones** y de **áreas internas**. Filtros por tipo y por estado: **Pendiente / Rechazado / Listo**. Permite aprobar o rechazar (con motivo) y actualiza el estado del camión vinculado.                                 |
| **Áreas internas**      | Flujo visual Recepción → Calidad → Producción → Almacén → Despacho, tarjetas por área con responsable, pendientes y tiempo promedio, y solicitudes de firma interna.                                                                                                |
| **Mi firma digital**     | Lienzo para dibujar con mouse/dedo/lápiz, colores y grosor; también permite escribir el nombre con distintos estilos. La firma se guarda y se muestra en la vista previa de los documentos.                                                                               |

## Relación camión ↔ firma

- Cada camión tiene un código propio, por ejemplo `CAM-2026-0148`.
- Cada solicitud de firma tiene su código, por ejemplo `FIR-2026-0231`.
- El campo `firmaId` del camión apunta a la firma que lo autoriza. Desde el registro del camión se puede abrir la firma, y desde la firma se identifica la placa del camión.
- Cuando la firma pasa a **Listo**, el camión pasa a **Autorizado**; si pasa a **Rechazado**, el camión pasa a **Rechazado**.

## Estructura

```
src/
  App.tsx                  Estado global y navegación entre secciones
  types.ts                 Modelos: Camion, Firma, Firmante, AreaInterna...
  data/                    Datos de ejemplo y metadatos de páginas
  components/
    Shell.tsx              Barra lateral y cabecera
    Icon.tsx               Iconos SVG + logotipo
    ui.tsx                 Chips de estado, modal, notificaciones, encabezados
    SignaturePad.tsx       Lienzo de firma y firma escrita
  pages/                   Dashboard, Camiones, Firmas, Areas, MiFirma
```
