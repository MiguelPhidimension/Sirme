import React from 'react'

const HomePage: React.FC = () => {
  return (
    <div className="hero min-h-96 bg-base-200 rounded-lg">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">¡Bienvenido a SIRME!</h1>
          <p className="py-6">
            Sistema de Registro de Mediciones - Gestiona y monitorea tus mediciones de manera eficiente.
          </p>
          <div className="flex gap-4 justify-center">
            <a href="/reports" className="btn btn-primary">
              Ver Reportes
            </a>
            <a href="/calendar" className="btn btn-outline">
              Calendario
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage 