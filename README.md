# 🚀 Vibe Coding — Laboratorio IA

Plataforma interactiva de curso para aprender **Vibe Coding** con IA. Incluye slides, laboratorios prácticos y soporte multilenguaje (ES / EN / PT).

## 📋 Requisitos

- Python 3.9+
- pip

## ⚡ Instalación

```bash
git clone https://github.com/enelgit/laboratorioIA.git
cd laboratorioIA
pip install -r requirements.txt
```

## ▶️ Ejecución

```bash
python3 app/main.py
```

La aplicación se levanta en **http://localhost:8000**

## 🏗️ Estructura del proyecto

```
app/
  main.py            # API FastAPI + servidor
data/
  en/                # Contenido en inglés
  es/                # Contenido en español
  pt/                # Contenido en portugués
    course.json      # Estructura del curso (días, módulos)
    slides.json      # Contenido de las slides por módulo
    labs.json        # Laboratorios prácticos por módulo
static/
  index.html         # SPA frontend
  css/styles.css     # Estilos (PicoCSS)
  js/app.js          # Lógica de navegación y renderizado
```

## 🔌 API Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/course?lang=es` | Estructura del curso |
| `GET` | `/api/slides/{module_id}?lang=es` | Slides de un módulo |
| `GET` | `/api/labs/{module_id}?lang=es` | Laboratorio de un módulo |

Idiomas soportados: `en`, `es`, `pt`

## 🗄️ Base de datos de pruebas

El curso incluye un laboratorio con conexión a MySQL/MariaDB. Para configurar:

1. Crear el archivo `connection.yaml` en la raíz:

```yaml
mysql:
  host: <IP_SERVIDOR>
  port: 3306
  user: <USUARIO>
  password: <PASSWORD>
  database: <BASE_DE_DATOS>
  charset: utf8mb4
```

2. Poblar con datos de prueba (tienda online):

```bash
pip install pymysql pyyaml
python3 seed_db.py
```

Esto crea las tablas: `categories`, `products`, `customers`, `orders`, `order_items`, `stock_movements` con datos realistas.

## 📄 Licencia

Uso educativo.
