import React from 'react'
import { Outlet } from 'react-router-dom'

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Header/Navigation */}
      <header className="navbar bg-primary text-primary-content">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li><a href="/reports">Reportes</a></li>
              <li><a href="/calendar">Calendario</a></li>
              <li><a href="/test-roles">Test Roles</a></li>
              <li><a href="/debug">Debug</a></li>
              <li><a href="/entry">Entrada</a></li>
            </ul>
          </div>
          <a className="btn btn-ghost text-xl" href="/">SIRME</a>
        </div>
        
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li><a href="/reports">Reportes</a></li>
            <li><a href="/calendar">Calendario</a></li>
            <li><a href="/test-roles">Test Roles</a></li>
            <li><a href="/debug">Debug</a></li>
            <li><a href="/entry">Entrada</a></li>
          </ul>
        </div>
        
        <div className="navbar-end">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <div className="bg-neutral-focus text-neutral-content rounded-full w-10 h-10 flex items-center justify-center">
                  <span className="text-xl">👤</span>
                </div>
              </div>
            </div>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li><a>Perfil</a></li>
              <li><a>Configuración</a></li>
              <li><a>Cerrar Sesión</a></li>
            </ul>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="footer footer-center p-4 bg-base-300 text-base-content">
        <aside>
          <p>Copyright © 2024 - SIRME - Sistema de Registro de Mediciones</p>
        </aside>
      </footer>
    </div>
  )
}

export default Layout 