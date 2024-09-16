'use client'

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase'; // Ajusta la ruta de tu configuración de Firebase
import { onAuthStateChanged } from 'firebase/auth';

const ProfilePage = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);

  useEffect(() => {
    // Escucha el cambio de autenticación
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        setEmail(user.email); // Establece el correo del usuario autenticado
        
        // Obtener la parte del nombre y apellido del email
        const emailNamePart = user.email.split('@')[0]; // Ejemplo: 'carlos.mendoza'
        const nameParts = emailNamePart.split('.'); // Separar por el punto

        // Verifica que haya al menos dos partes (nombre y apellido)
        if (nameParts.length === 2) {
          const [first, last] = nameParts;
          setFirstName(first ? first.charAt(0).toUpperCase() + first.slice(1) : ''); // Primer letra mayúscula
          setLastName(last ? last.charAt(0).toUpperCase() + last.slice(1) : ''); // Primer letra mayúscula
        } else {
          // Manejo si no hay punto o formato esperado
          setFirstName(emailNamePart); // Usa el email antes del @ como nombre completo
          setLastName(''); // No hay apellido disponible
        }
      } else {
        setEmail(null); // No hay usuario autenticado
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!email) {
    return <p>No hay usuario autenticado.</p>;
  }

  return (
    <div className="container mx-auto mt-8 max-w-[560px]">
      <div className="flex justify-between items-center pb-4 border-b border-dashed border-gray-900 mb-4">
        <h1 className="text-3xl font-semibold">Perfil</h1>
      </div>
      <p>Correo: {email}</p>
      <p>Nombre: {firstName} {lastName}</p> {/* Mostramos los nombres separados */}
    </div>
  );
};

export default ProfilePage;
