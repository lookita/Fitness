# ⏩ Reporte Técnico — Fase 14: Avance Manual con Validación de XP

Este reporte detalla la implementación del sistema de control de progresión, donde el usuario decide cuándo avanzar, sujeto a una estricta validación de esfuerzo acumulado (Regla de Porcentajes).

---

## 1. 🛡️ La Regla de los Porcentajes (Validación de XP)

Se ha implementado una capa de seguridad en el backend para evitar el avance prematuro. Para que un usuario pueda pasar a la siguiente etapa (Semana 1 a 4), el sistema verifica su XP acumulada en el nivel actual:

- **De Semana 1 ⏩ 2**: Requiere haber alcanzado el **25%** de la XP necesaria para subir de nivel.
- **De Semana 2 ⏩ 3 (Inicio de Fase 2)**: Requiere el **50%** de la XP del nivel.
- **De Semana 3 ⏩ 4**: Requiere el **75%** de la XP del nivel.
- **De Semana 4 ⏩ Nivel Siguiente**: Requiere el **100%** de la XP del nivel.

Si el usuario intenta avanzar sin cumplir estos requisitos, el sistema arroja un error detallado indicando exactamente cuánta XP le falta para la siguiente **Semana lineal**.

---

## 2. 📂 Archivos y Cambios Clave

### Backend (Robustez Matemática)

- **`perfil-fisico.service.ts`**: Refactorizado para calcular dinámicamente el rango de XP del nivel actual y validar el umbral proporcional según la posición global en el mes (4 semanas).
- **`perfil-fisico.controller.ts`**: Expone el nuevo endpoint seguro `POST /avanzar-semana`.

### Frontend (Control del Usuario)

- **`Dashboard.tsx`**: Se integró el botón **"PASAR A SIGUIENTE SEMANA ⏩"**.
- **`UsuariosService`**: Se añadió el método para invocar la validación de avance en el servidor.
- **Feedback**: Implementación de alertas dinámicas que informan al usuario sobre el éxito del avance o los requisitos faltantes.

---

## 3. 🎯 Impacto en la Experiencia

El usuario ahora tiene el control total de su ritmo de entrenamiento, pero bajo un marco de consistencia. El sistema garantiza que cada etapa de las 4 semanas haya sido aprovechada al máximo antes de permitir el acceso a nuevos desafíos.

**Documento finalizado el 28 de febrero de 2026.**
**Desarrollado con compromiso por Antigravity.**
