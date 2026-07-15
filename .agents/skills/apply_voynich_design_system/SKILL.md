---
name: apply_voynich_design_system
description: Analiza componentes de UI existentes y dicta las reglas de refactorización para alinearlos con la estética Voynich. Define la evolución de componentes estándar hacia estructuras orgánicas, diagramas botánicos e interfaces encriptadas.
---

# 📜 Skill: apply_voynich_design_system

## Descripción Semántica
Analiza componentes de UI existentes y dicta las reglas de refactorización para alinearlos con la estética Voynich. Define la evolución de componentes estándar hacia estructuras orgánicas, diagramas botánicos e interfaces encriptadas, integrando tokens de Tailwind específicos para texturas de pergamino y micro-interacciones de cifrado.

## 1. Definición del Esquema (JSON)
```json
{
  "name": "apply_voynich_design_system",
  "description": "Aplica estándares de diseño del Manuscrito Voynich a componentes existentes o define nuevos folios de la librería.",
  "parameters": {
    "type": "object",
    "properties": {
      "component_scope": {
        "type": "string",
        "description": "Nombre del componente a profesionalizar o crear (ej: 'Button', 'Sidebar', 'DataGrid')."
      },
      "voynich_archetype": {
        "type": "string",
        "enum": ["botanical_organic", "astronomical_circular", "cryptographic_text", "vellum_container"],
        "description": "El arquetipo visual: Botánico (orgánico), Astronómico (radial), Criptográfico (texto denso) o Vitela (contenedores)."
      },
      "interaction_mode": {
        "type": "string",
        "enum": ["reveal_on_hover", "hidden_in_plain_sight", "permanent_cipher"],
        "description": "Define cómo interactúa el usuario con la información encriptada."
      }
    },
    "required": ["component_scope", "voynich_archetype"]
  }
}
```

## 2. Guía de Implementación: El Estándar Profesional

Para profesionalizar tus componentes actuales, la skill debe aplicar estos tres pilares:

### A. La Geometría de lo Imperfecto (CSS/Tailwind)
* **Bordes "Vellum"**: Olvida el `rounded-lg`. Usa `mask-image` con SVGs de bordes rasgados o `border-radius` asimétricos.
  * *Tip*: Usa utilidades como `rounded-[40%_10%_80%_20%/20%_60%_40%_90%]`.
* **Filtros de Tinta**: Aplicar un filtro de `contrast(1.2) brightness(0.9) sepia(0.3)` a los textos para que parezcan integrados en el papel y no "flotando" digitalmente.

### B. Anatomía de los Componentes (Nuevas Reglas)
* **Inputs -> "Scribes"**: Los campos de texto no deben tener cajas. Deben ser líneas sutiles, irregulares, con un cursor que parezca una gota de tinta.
* **Modales -> "Unfolding Folios"**: No deben "aparecer"; deben animarse como si un pergamino se desenrollara (usando `scale-y` y `origin-top`).
* **Tooltips -> "Marginalia"**: Notas pequeñas al margen con dibujos botánicos abstractos que aparecen de forma no lineal.

### C. Storybook como "Códice Digital"
* **Documentación Autogenerada**: Cada componente en Storybook debe incluir una sección de "Lore" o "Origen del Glifo", explicando qué parte de la civilización perdida representa ese botón o card.
* **Decoradores de Fondo**: Configura un decorator global que envuelva cada historia en una textura de vitela de alta resolución.

## 3. Qué evitar para mantener el nivel "Pro"

* **Evitar el "Pixel Perfect"**: Si una línea es demasiado recta, rompe la ilusión. Usa la skill para añadir sutiles variaciones de `rotate-[0.5deg]` o `-rotate-[0.5deg]` de forma aleatoria.
* **Colores Sólidos**: Prohibido usar `bg-white` o `bg-gray-100`. Todo debe tener un gradiente radial muy suave de tonos crema y hueso.
* **Iconos Genéricos**: No uses Lucide o FontAwesome directamente. Pásalos por un filtro de "trazo manual" o envuélvelos en círculos astrológicos concéntricos.

## 🛠️ Ejemplo de aplicación en un componente existente

Si tienes un `Button` simple, la skill dictaría esta transformación:

* **Estado Base**: Fondo `bg-parchment`, borde `border-ink/30` con trazo irregular.
* **Tipografía**: Fuente con ligaduras extrañas.
* **Animación**: Al hacer clic, una pequeña mancha de "tinta" se expande desde el centro (sustituyendo el efecto ripple clásico de Material Design).
