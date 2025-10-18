import { useState, useEffect } from "react";
import { Usuario } from "../../../types/Usuarios/usuario";
import Button  from "../../ui/button/Button";

interface EditUsuarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  usuario: Usuario;
  onSubmit: (updatedData: Partial<Usuario>) => void;
}

export default function EditUsuarioModal({ isOpen, onClose, usuario, onSubmit }: EditUsuarioModalProps) {
  const [formData, setFormData] = useState<Partial<Usuario>>({});

  useEffect(() => {
    if (usuario) {
      setFormData(usuario);
    }
  }, [usuario]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Editar Usuario</h2>

        <input
          className="w-full border p-2 mb-2 rounded"
          name="nombre"
          value={formData.nombre || ""}
          onChange={handleChange}
          placeholder="Nombre"
        />

        <input
          className="w-full border p-2 mb-2 rounded"
          name="email"
          value={formData.email || ""}
          onChange={handleChange}
          placeholder="Correo"
        />

        <select
          className="w-full border p-2 mb-2 rounded"
          name="rol"
          value={formData.rol || ""}
          onChange={handleChange}
        >
          <option value="empleado">Empleado</option>
          <option value="administrador">Administrador</option>
        </select>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>Guardar Cambios</Button>
        </div>
      </div>
    </div>
  );
}
