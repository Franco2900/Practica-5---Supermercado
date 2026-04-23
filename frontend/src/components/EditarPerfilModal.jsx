import { useContext, useState } from "react";
import { UsuarioContext } from "../context/UsuarioContext.jsx";

// Importo las funciones desde helpers
import { actualizarPerfil } from "./EditarPerfilModal.helpers.js";

export default function EditarPerfilModal() 
{
    // Variables de contexto
    const { usuario, setUsuario } = useContext(UsuarioContext);

    // Variables de estado
    const [nombre, setNombre] = useState(usuario?.nombre || "");
    const [telefono, setTelefono] = useState(usuario?.telefono || "");
    const [direccion, setDireccion] = useState(usuario?.direccion || "");
    const [imagen, setImagen] = useState(null);

    if (!usuario) return null;

    // Función que llama al helper con los estados actuales
    const handleGuardar = () => {
        actualizarPerfil( {usuario_id: usuario.id, nombre, telefono, direccion, imagen}, setUsuario );
    };


    return (
        <div className="modal fade" id="editarPerfilModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
            
                <div className="modal-header">
                    <h5 className="modal-title">Editar perfil</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                </div>
                
                <div className="modal-body">
                    <form>

                        <div className="mb-3">
                            <label className="form-label">Nombre</label>
                            <input 
                            type="text" 
                            className="form-control" 
                            value={nombre} 
                            onChange={(e) => setNombre(e.target.value)}  
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Teléfono</label>
                            <input 
                            type="text" 
                            className="form-control" 
                            value={telefono} 
                            onChange={(e) => setTelefono(e.target.value)} 
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Dirección</label>
                            <input 
                            type="text" 
                            className="form-control" 
                            value={direccion} 
                            onChange={(e) => setDireccion(e.target.value)}  
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Foto de perfil</label>

                            {/* Imagen actual */}
                            <div className="mb-2 text-center">
                                <p className="text-muted">Imagen actual:</p>
                                <img
                                src={usuario.fuente_imagen || "/images/perfil/perfil generico.jpg"}
                                alt="Foto actual"
                                className="rounded-circle border border-2"
                                style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                />
                            </div>

                            {/* Input para nueva imagen */}
                            <input
                                type="file"
                                className="form-control"
                                accept="image/*"
                                onChange={(e) => setImagen(e.target.files[0])}
                            />

                            {/* Preview de la nueva imagen */}
                            {imagen && (
                                <div className="mt-2 text-center">
                                <p className="text-muted">Nueva imagen seleccionada:</p>
                                <img
                                    src={URL.createObjectURL(imagen)}
                                    alt="Preview nueva imagen"
                                    className="rounded-circle border border-2"
                                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                />
                                </div>
                            )}
                            
                        </div>

                    </form>
                </div>
                
                <div className="modal-footer">
                    <button 
                    type="button" 
                    className="btn btn-secondary" 
                    data-bs-dismiss="modal"
                    >
                        Cancelar
                    </button>
                    
                    <button 
                    type="button" 
                    className="btn btn-primary"
                    data-bs-dismiss="modal" 
                    onClick={handleGuardar}
                    >
                        Guardar cambios
                    </button>
                </div>

            </div>
        </div>
        </div>
    );
}
