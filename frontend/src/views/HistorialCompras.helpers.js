import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Maneja el cambio de un input de fecha.
 * @param {Function} setFecha - Setter de estado (setFechaInicio o setFechaFin)
 * @returns {Function} handler para onChange
 */
export function handleFechaChange(setFecha) 
{
  return (e) => setFecha(e.target.value);
}

/**
 * Limpia los filtros de fecha y vuelve a cargar el historial completo.
 * @param {Function} setFechaInicio - Setter de estado para fechaInicio
 * @param {Function} setFechaFin - Setter de estado para fechaFin
 * @param {Function} setProductos - Setter de estado para productos
 * @param {string} endpoint - URL base del backend
 * @param {number} usuarioId - ID del usuario
 */
export async function limpiarFiltros(setFechaInicio, setFechaFin, setProductos, endpoint, usuarioId) 
{
  setFechaInicio("");
  setFechaFin("");

  const data = await fetchHistorial(endpoint, usuarioId);
  setProductos(data);
}


/**
 * Agrupa productos por fecha/hora exacta de compra.
 * @param {Array} productos - Lista de productos con campo fecha_compra
 * @returns {Object} Objeto con claves ISO y arrays de productos
 */
export function agruparPorCompra(productos) 
{
    const grupos = {}; // Arreglo vacio

    productos.forEach((p) => {
        const clave = new Date(p.fecha_compra).toISOString();// Obtengo la fecha y hora y la formateo a string
        
        if (!grupos[clave]) grupos[clave] = []; // Si no existe todavía un grupo con esa fecha y hora, lo creo como array vacío
        
        grupos[clave].push(p); // Agrego el producto dentro del grupo correspondiente
    });

    return grupos;
}

/**
 * Fetch para obtener historial de compras.
 * @param {string} endpoint - URL base del backend
 * @param {number} usuarioId - ID del usuario
 * @returns {Promise<Array>} Lista de productos
 */
export async function fetchHistorial(endpoint, usuarioId) 
{
    const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            usuario_id: usuarioId 
        })
    });

    return res.json();
}


/**
 * Fetch con filtro de fechas.
 * @param {string} endpoint - URL base del backend
 * @param {number} usuarioId - ID del usuario
 * @param {string} fechaInicio - Fecha desde (YYYY-MM-DD)
 * @param {string} fechaFin - Fecha hasta (YYYY-MM-DD)
 * @returns {Promise<Array>} Lista de productos filtrados
 */
export async function fetchHistorialConFiltro(endpoint, usuarioId, fechaInicio, fechaFin) 
{
    const res = await fetch(endpoint + "/busquedaConFiltro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            usuario_id: usuarioId,
            fecha_desde: fechaInicio,
            fecha_hasta: fechaFin
        })
    });

    return res.json();
}

/**
 * Formatea una fecha ISO a string legible en español (Argentina).
 * @param {string} fechaISO - Fecha en formato ISO
 * @returns {string} Texto con fecha y hora formateada
 */
export function formatearFechaCompra(fechaISO) 
{
    const fecha = new Date(fechaISO);

    return `Compra realizada el ${fecha.toLocaleDateString("es-AR")} a las ${fecha.toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    })}`;
}


/**
 * Calcula el total gastado en una compra.
 * @param {Array} productosCompra - Lista de productos de una compra
 * @returns {number} Total gastado
 */
export function calcularTotalCompra(productosCompra) 
{
  let total = 0;

  const ofertasUnicas = new Set(); // Set para evitar sumar dos veces la misma oferta

    productosCompra.forEach((prod) => {
        if (prod.oferta_id && prod.precio_oferta) 
        {
            if (!ofertasUnicas.has(prod.oferta_id)) 
            {
                total += prod.precio_oferta;
                ofertasUnicas.add(prod.oferta_id);
            }
        } 
        else 
        {
            total += prod.precio * (prod.cantidad || 1);
        }
    });

    return total;
}


/**
 * Genera un PDF con el detalle de una compra.
 * Incluye título con fecha y hora, tabla con productos e imágenes, y total.
 * @param {string} usuarioNombre - Nombre del usuario comprador
 * @param {string|Date} fechaCompra - Fecha de la compra
 * @param {Array} productosCompra - Lista de productos de la compra
 * @param {number} totalCompra - Total gastado en la compra
 */
export async function generarPDFCompra(usuarioNombre, fechaCompra, productosCompra, totalCompra) 
{
    // Nuevo archivo PDF
    const doc = new jsPDF();

    // Fecha y hora actuales
    const fechaHora = new Date(fechaCompra);
    const fechaStr = fechaHora.toLocaleDateString("es-AR");
    const horaStr = fechaHora.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });

    // Título con fecha y hora
    doc.setFontSize(16); // Tamaño de la fuente
    doc.text(`Compra del ${fechaStr} ${horaStr}`, 14, 20); // Título

    const filas = []; // Filas que contendran los datos de la tabla

    for (const p of productosCompra) 
    {
        // Construyo la URL absoluta
        const urlImagen = `${window.location.origin}${p.fuenteImagen || "images/producto-generico.jpg"}`;

        // Parseo la imagen a base64
        const imgBase64 = await cargarImagenBase64(urlImagen);

        // Nueva columna: tipo de producto
        const tipoProducto = p.oferta_id 
        ? `Oferta: ${p.oferta_nombre}` 
        : "Producto individual";

        // Cargo las filas con los datos de los productos
        filas.push([
            { raw: imgBase64, content: "" },                              // Imagen
            p.nombre,                                                     // Nombre
            tipoProducto,                                                 // Producto indivual u Oferta
            `$${p.precio.toLocaleString("es-AR")}`,                       // Precio
            p.cantidad || 1,                                              // Cantidad comprada
            `$${(p.precio * (p.cantidad || 1)).toLocaleString("es-AR")}`  // Subtotal
        ]);
    }

    // Tabla
    autoTable(doc, {

        head: [["Imagen", "Producto", "Tipo", "Precio unitario", "Cantidad", "Subtotal"]], // Encabezado de la tabla
        body: filas, // Cuerpo de la tabla
        startY: 30,  // Posición vertical donde empieza la tabla

        styles: {
            minCellHeight: 20,           // Alto mínimo de cada celda/fila
            fontSize: 10,                // Tamaño de la fuente
            textColor: [40, 40, 40],     // Color del texto (gris oscuro)
            lineColor: [200, 200, 200],  // Color de las líneas
            lineWidth: 0.2,              // Grosor de las líneas
            halign: "center",            // Alineación horizontal por defecto
            valign: "middle"             // Alineación vertical
        },
        headStyles: {
            fillColor: [41, 128, 185],   // Azul para el encabezado
            textColor: 255,              // Texto blanco
            fontStyle: "bold",           // Negrita
            halign: "center"
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245]   // Color de fondo alternado (gris claro)
        },
        columnStyles: {
            0: { halign: "center", cellWidth: 22 }, // Columna de imagen más angosta
            1: { halign: "center", cellWidth: 60 }, // Producto alineado a la izquierda
            2: { halign: "center", cellWidth: 30 }, // Precio unitario alineado a la derecha
            3: { halign: "center", cellWidth: 25 }, // Cantidad centrada
            4: { halign: "center", cellWidth: 30 }  // Subtotal alineado a la derecha
        },

        // Dibujo en una celda
        didDrawCell: (data) => 
        {
            // Si la celda pertenece a la primera columna y tiene un string base64 
            if (data.column.index === 0 && data.cell.raw && typeof data.cell.raw.raw === "string") 
            {
                const imgBase64 = data.cell.raw.raw;
                console.log(data.cell)

                // Detecto formato
                let formato = "JPEG";
                if (imgBase64.startsWith("data:image/png")) formato = "PNG";
                else if (imgBase64.startsWith("data:image/jpeg")) formato = "JPEG";
                else if (imgBase64.startsWith("data:image/jpg"))  formato = "JPEG";
                else if (imgBase64.startsWith("data:image/webp")) formato = "WEBP";

                // Añado la imagen en la celda indicando la posición y el tamaño
                doc.addImage(imgBase64, formato, data.cell.x + 2, data.cell.y + 2, 16, 16);
            }
        }

    });


    const finalY = doc.lastAutoTable.finalY + 10; // Posición vertical final de la tabla + 10 unidades
    doc.setFontSize(14);                          // Tamaño de la fuente
    doc.text(`Total: $${totalCompra.toLocaleString("es-AR")}`, 14, finalY); // Total

    doc.save(`Sol Ultra - Recibo de Compra - ${usuarioNombre} - ${fechaStr} ${horaStr}.pdf`); // Descarga del archivo
}


/**
 * Convierte una imagen en Base64 para poder insertarla en el PDF.
 * @param {string} url - URL de la imagen
 * @returns {Promise<string>} String Base64 con prefijo data:image/...
 */
export async function cargarImagenBase64(url) 
{
    const urlCodificada = encodeURI(url); // Codifico la URL para que espacios y caracteres especiales no rompan

    const imagen = await fetch(urlCodificada);  // Busca la imagen
    const blob = await imagen.blob(); // Convierte la respuesta en un blob (archivo binario)

    return new Promise((resolve) => {
        const reader = new FileReader();                    // Nueva instancia de FileReader 
        reader.onloadend = () => resolve(reader.result);    // Evento que define qué hacer cuando el lector termina de procesar el archivo. En este caso, devuelve el string Base64 generado por readAsDataURL
        reader.readAsDataURL(blob);                         // Lee el contenido del blob y lo transforma en una cadena Base64
    });
}
